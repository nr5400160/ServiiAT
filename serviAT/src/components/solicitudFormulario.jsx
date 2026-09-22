import Swal from 'sweetalert2';
import { Cpu, Fan } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
// import { cliente } from '../supabase/cliente'; // Ya no se necesita aquí

function Formulario() {
    const [appliance, setAppliance] = useState("");
    const navigate = useNavigate();

    const [datosValidar, setDatosValidar] = useState({
        equipo: "",
        categoria: "Industrial",
        nombreCliente: "",
        apellidoCliente: "",
        gmail: "",
        telefono: "",
        direccion: "",
        descripcion: "",
        modelo: ""
    });

    const [horaSeleccionada, setHoraSeleccionada] = useState("");
    const horarios = [
        "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
        "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
    ];

    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

    const reservado = [
        { id: 1, Date: new Date(2026, 3, 25) },
        { id: 2, Date: new Date(2026, 3, 31) }
    ];

    const fechasReservas = reservado.map(e => e.Date.toDateString());

    const bloquearFechas = ({ date, view }) => {
        if (view === 'month') {
            const esDomingo = date.getDay() === 0;
            return esDomingo || fechasReservas.includes(date.toDateString());
        }
        return false;
    };

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setDatosValidar(prev => ({ ...prev, [name]: value }));
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();

        if (!appliance || !horaSeleccionada) {
            Swal.fire("Paso faltante", "Por favor selecciona el tipo de servicio y la hora.", "warning");
            return;
        }

        const userGuardado = JSON.parse(localStorage.getItem("user"));
        if (!userGuardado) {
            Swal.fire("Atención", "Debes iniciar sesión para agendar un servicio.", "warning");
            return;
        }

        // Estructuramos los datos completos que necesita la vista de confirmación
        const datosCompletos = {
            ...datosValidar,
            fecha: fechaSeleccionada.toISOString().split('T')[0],
            hora: horaSeleccionada,
            servicio: appliance
        };

        // Pasamos a la vista de validación enviando los datos por el state
        navigate("/ValidarInformacion", { state: datosCompletos });

        /* 
        ===============================================================
        CÓDIGO COMENTADO: CONEXIÓN CON MYSQL WORKBENCH Y LOCALHOST
        ===============================================================
        const idEstadoPendiente = 1; // Asumiendo ID por defecto
        const idCategoria = 1; // Asumiendo ID por defecto
        const idAdministrador = 1;

        const datosParaMySQL = {
            nombre_equipo: datosValidar.equipo,
            modelo_equipo: datosValidar.modelo || "N/A",
            id_categoria_equipo: idCategoria,
            fecha_solicitud: fechaSeleccionada.toISOString().split('T')[0],
            descripcion: datosValidar.descripcion,
            direccion_servicio: datosValidar.direccion,
            usuario_id_cliente: userGuardado.id, 
            id_estado_solicitud: idEstadoPendiente,
            usuario_id_administrador: idAdministrador
        };

        try {
            const respuesta = await fetch('http://localhost:3001/api/solicitud', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosParaMySQL)
            });

            const resultado = await respuesta.json();
            if (!respuesta.ok) throw new Error(resultado.error || "Error al guardar localmente");

            // Enviar notificación
            const datosNotificaciones = { email: datosValidar.gmail, estado: "Pendiente" };
            await fetch('http://localhost:3001/api/notificaciones/enviar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosNotificaciones)
            });

            await Swal.fire({
                icon: "success",
                title: "¡Guardado en MySQL Workbench!",
                text: "La solicitud de servicio se registró correctamente de forma local.",
                confirmButtonColor: '#2563eb'
            });
        } catch(error) {
            console.error("Error MySQL:", error);
        }
        ===============================================================
        */
    };

    return (
        <section className="py-5" style={{ background: '#f0f2f5', minHeight: '100vh' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <form onSubmit={manejarEnvio} className="p-4 p-md-5 shadow-lg rounded-4 bg-white border-0">
                            <div className="text-center mb-5">
                                <h2 className="fw-bold text-dark">Agenda tu Servicio Técnico</h2>
                                <p className="text-muted">AR Asistencia Técnica - Profesionalismo a tu alcance</p>
                            </div>

                            <div className="row g-4">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Nombres *</label>
                                    <input type="text" name='nombreCliente' value={datosValidar.nombreCliente} onChange={manejarCambio} className="form-control form-control-lg shadow-sm" placeholder="Ej: Santiago" required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Apellidos *</label>
                                    <input type="text" name='apellidoCliente' value={datosValidar.apellidoCliente} onChange={manejarCambio} className="form-control form-control-lg shadow-sm" placeholder="Ej: De Hoyos" required />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-semibold">Dirección Completa *</label>
                                    <input type="text" name='direccion' value={datosValidar.direccion} onChange={manejarCambio} className="form-control form-control-lg shadow-sm" placeholder="Ej: Calle 10 #20-30, Barrio El Prado" required />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Equipo *</label>
                                    <input type="text" name='equipo' value={datosValidar.equipo} onChange={manejarCambio} className="form-control form-control-lg shadow-sm" placeholder="Ej: Aire Acondicionado" required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Categoría</label>
                                    <select name='categoria' value={datosValidar.categoria} onChange={manejarCambio} className="form-select form-select-lg shadow-sm">
                                        <option value="Industrial">Industrial</option>
                                        <option value="Doméstico">Doméstico</option>
                                    </select>
                                </div>

                                <div className="col-12 my-3">
                                    <label className="form-label d-block fw-bold text-center">¿Qué servicio requieres?</label>
                                    <div className="d-flex justify-content-center gap-3">
                                        <button type="button" onClick={() => setAppliance("Reparación")}
                                            className={`btn px-4 py-3 border-2 d-flex align-items-center gap-2 ${appliance === 'Reparación' ? 'btn-primary border-primary' : 'btn-outline-secondary border-light bg-light'}`}>
                                            <Cpu size={20} /> Reparación
                                        </button>
                                        <button type="button" onClick={() => setAppliance("Instalación")}
                                            className={`btn px-4 py-3 border-2 d-flex align-items-center gap-2 ${appliance === 'Instalación' ? 'btn-primary border-primary' : 'btn-outline-secondary border-light bg-light'}`}>
                                            <Fan size={20} /> Instalación
                                        </button>
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <label className="form-label fw-semibold">Descripción del fallo</label>
                                    <textarea name='descripcion' value={datosValidar.descripcion} onChange={manejarCambio} className="form-control shadow-sm" rows="3" placeholder="Describe brevemente el problema..." required></textarea>
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label fw-semibold">Teléfono</label>
                                    <input type="tel" name='telefono' value={datosValidar.telefono} onChange={manejarCambio} className="form-control shadow-sm" placeholder="3001234567" required />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-semibold">Modelo (Opcional)</label>
                                    <input type="text" name='modelo' value={datosValidar.modelo} onChange={manejarCambio} className="form-control shadow-sm" />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-semibold">Email</label>
                                    <input type="email" name='gmail' value={datosValidar.gmail} onChange={manejarCambio} className="form-control shadow-sm" required />
                                </div>

                                <div className="col-lg-7 mt-4">
                                    <p className="fw-bold text-center mb-2">Selecciona la Fecha</p>
                                    <div className="bg-light p-2 rounded shadow-sm d-flex justify-content-center">
                                        <Calendar onChange={setFechaSeleccionada} value={fechaSeleccionada} tileDisabled={bloquearFechas} minDate={new Date()} />
                                    </div>
                                </div>

                                <div className="col-lg-5 mt-4">
                                    <p className="fw-bold text-center mb-2">Horario de Atención</p>
                                    <div className="row g-2">
                                        {horarios.map((h) => (
                                            <div key={h} className="col-6 col-md-4 col-lg-6">
                                                <button type="button" onClick={() => setHoraSeleccionada(h)}
                                                    className={`btn btn-sm w-100 ${horaSeleccionada === h ? 'btn-primary' : 'btn-outline-primary bg-white'}`}>
                                                    {h}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="col-12 mt-5">
                                    <button type='submit' className="btn btn-primary btn-lg w-100 fw-bold shadow">
                                        Ir a Validar Servicio
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Formulario;