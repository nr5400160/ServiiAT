import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from 'sweetalert2';
import { cliente } from '../supabase/cliente'; // Importamos la conexión a Supabase

function ServicioConfirmado() {
    const navigate = useNavigate();
    const location = useLocation();
    const tecnicoNombre = "Fabio Alexander Rojas Lara";
    const [cargando, setCargando] = useState(false);

    const datos = location.state;

    if (!datos) {
        return (
            <div className="container py-5 text-center">
                <h2>No hay datos de reserva activos</h2>
                <button className="btn btn-primary" onClick={() => navigate("/Formulario")}>Ir al formulario</button>
            </div>
        );
    }

    const confirmarEnSupabase = async () => {
        setCargando(true);
        try {
            const userGuardado = JSON.parse(localStorage.getItem("user"));
            if (!userGuardado) {
                throw new Error("Debes iniciar sesión para agendar un servicio.");
            }

            // 1. Obtener ID de la categoría
            const { data: catData, error: catError } = await cliente
                .from('categoria_equipo')
                .select('id_categoria_equipo')
                .eq('nombre_categoria', datos.categoria)
                .single();

            if (catError || !catData) throw new Error("Categoría no encontrada: " + datos.categoria);

            // 2. Obtener ID del estado 'Pendiente'
            const { data: estadoData, error: estadoError } = await cliente
                .from('estado')
                .select('id_estado')
                .eq('nombre_estado', 'Pendiente')
                .single();

            if (estadoError || !estadoData) throw new Error("Estado 'Pendiente' no encontrado.");

            const idEstadoPendiente = estadoData.id_estado;
            const idCategoria = catData.id_categoria_equipo;
            const idAdministrador = 1; // Ajusta según la estructura de ServiAT

            // 3. Insertar el nuevo equipo
            const { data: equipoInsertado, error: equipoError } = await cliente
                .from('equipo')
                .insert([{
                    nombre_equipo: datos.equipo,
                    marca_equipo: "No especificada",
                    modelo_equipo: datos.modelo || "N/A",
                    id_categoria_equipo: idCategoria
                }])
                .select();

            if (equipoError) throw equipoError;
            const idDelNuevoEquipo = equipoInsertado[0].id_equipo;

            // 4. Insertar la solicitud final
            const { error: errorSolicitud } = await cliente
                .from('solicitud')
                .insert([{
                    fecha_solicitud: datos.fecha,
                    descripcion: datos.descripcion,
                    direccion_servicio: datos.direccion,
                    usuario_id_administrador: idAdministrador,
                    usuario_id_cliente: userGuardado.id,
                    id_estado_solicitud: idEstadoPendiente,
                    id_equipo: idDelNuevoEquipo
                }]);

            if (errorSolicitud) throw errorSolicitud;

            // Notificación vía correo (Backend Node)
            try {
                await fetch('http://localhost:3001/api/notificaciones/enviar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: datos.gmail, estado: "Pendiente" })
                });
            } catch (err) {
                console.warn("La solicitud se guardó, pero hubo un problema enviando el correo.");
            }

            await Swal.fire({
                icon: "success",
                title: "¡Reserva Confirmada!",
                text: `Tu servicio ha sido agendado exitosamente con ${tecnicoNombre}.`,
                confirmButtonColor: '#1abc9c'
            });

            // Redirigir al usuario al Home o Dashboard después del éxito
            navigate("/"); 

        } catch (error) {
            console.error("Error en Supabase:", error);
            Swal.fire({
                icon: "error",
                title: "Error al guardar",
                text: error.message || "No se pudo completar la reserva.",
            });
        } finally {
            setCargando(false);
        }
    };

    return (
        <section className="py-4">
            <div className="container py-5 text-center">
                <div className="row g-4 justify-content-center">
                    <div className="text-center mb-4 d-flex flex-column align-items-center">
                        <div className="d-inline-flex align-items-center justify-content-center"
                            style={{
                                width: '80px',
                                height: '80px',
                                backgroundColor: '#f0faf5',
                                borderRadius: '50%',
                                border: '3px solid #1abc9c',
                                marginBottom: '15px'
                            }}
                        >
                            <i className="bi bi-card-checklist" style={{
                                fontSize: '40px',
                                color: '#1abc9c',
                                display: 'block'
                            }}></i>
                        </div>

                        <p className="py-3" style={{ fontSize: '28px', color: '#1abc9c', margin: '0', lineHeight: '1.2', fontWeight: 'bold' }}>
                            Validación de Reserva
                        </p>
                    </div>

                    <div className="container d-flex justify-content-center py-5">
                        <div className="card shadow-lg border-0 rounded-4 p-4" style={{ maxWidth: '600px', width: '100%' }}>
                            <div className="card-body text-center">
                                <h2 className="card-title fw-bold mb-3">Verifica tu servicio</h2>
                                <h6 className="card-text text-muted mb-4">Por favor revisa los detalles de tu solicitud antes de confirmar la reserva.</h6>

                                <div className="alert-border border-2 p-4 mb-4" style={{ backgroundColor: '#f2d2d2', borderRadius: '1rem', border: '1px solid #f2d2d2' }}>
                                    <p className="fw-bold mb-3 d-flex align-items-center text-start" style={{ color: '#fe1515', fontWeight: '500' }}>Resumen del servicio</p>

                                    <div className="container-fluid p-0">
                                        <div className="row g-4 text-start">
                                            <div className="col-12 col-md-6">
                                                <p className="text-muted mb-1">Fecha y hora:</p>
                                                <p className="text-dark fw-normal">{datos.fecha} a las {datos.hora}</p>
                                            </div>

                                            <div className="col-12 col-md-6">
                                                <p className="text-muted mb-1">Cliente:</p>
                                                <p className="text-dark fw-normal text-uppercase">{datos.nombreCliente} {datos.apellidoCliente}</p>
                                            </div>

                                            <div className="col-12 col-md-6">
                                                <p className="text-muted mb-1">Servicio:</p>
                                                <p className="text-dark fw-normal">{datos.servicio}</p>
                                            </div>

                                            <div className="col-12 col-md-6">
                                                <p className="text-muted mb-1">Teléfono:</p>
                                                <p className="text-dark fw-normal">{datos.telefono}</p>
                                            </div>

                                            <div className="col-12 col-md-6">
                                                <p className="text-muted mb-1">Equipo:</p>
                                                <p className="text-dark fw-bold mb-0">
                                                    {datos.equipo} <span className="fw-normal text-muted">({datos.categoria})</span>
                                                </p>
                                            </div>

                                            <div className="col-12">
                                                <p className="text-muted mb-1">Dirección:</p>
                                                <p className="text-dark fw-normal">{datos.direccion}</p>
                                            </div>

                                            <div className="col-12">
                                                <p className="text-muted mb-1">Correo electrónico:</p>
                                                <p className="text-dark fw-normal">{datos.gmail}</p>
                                            </div>

                                            <div className="col-12">
                                                <p className="text-muted mb-1">Descripción del problema:</p>
                                                <p className="text-dark fw-normal">{datos.descripcion}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-body text-center">
                                    <div className="alert border border-primary border-2 p-4 mb-4" style={{ backgroundColor: '#eff6ff', borderRadius: '0.75rem' }}>
                                        <p className="fw-bold mb-3 d-flex text-primary">Información del Técnico</p>
                                        <ul className="list-unstyled mb-0" style={{ fontSize: '0.95rem' }}>
                                            <li className="mb-2">Nombre: <br />{tecnicoNombre}</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="d-flex gap-3 mt-4 justify-content-center flex-wrap">
                                    <button
                                        onClick={() => navigate("/Formulario")}
                                        className="btn btn-outline-secondary py-3 px-4 rounded-3 fw-bold shadow"
                                        disabled={cargando}
                                    >
                                        Cancelar / Editar
                                    </button>
                                    
                                    <button
                                        onClick={confirmarEnSupabase}
                                        className="btn btn-success py-3 px-5 rounded-3 fw-bold shadow"
                                        style={{ backgroundColor: '#1abc9c', border: 'none' }}
                                        disabled={cargando}
                                    >
                                        {cargando ? 'Guardando Reserva...' : 'Confirmar Reserva'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ServicioConfirmado;