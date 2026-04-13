import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
function ValidarInformacion() {
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const datos = location.state;

    const confirmarReserva = () => {
        setCargando(true);

        // Simulamos una petición al servidor de 2 segundos
        setTimeout(() => {
            setCargando(false);

            // Redirigir al inicio o a una página de "Mis Servicios"
            setMostrarAlerta(true);

            // 3. Esperamos un momento para que el usuario vea el mensaje de éxito antes de irse
            setTimeout(() => {
                navigate("/ServicioConfirmado", { state: datos });
            }, 2000);
        }, 2000);

    };

    const [mostrarAlerta, setMostrarAlerta] = useState(false);

    const manejarConfirmacion = () => {
        // 1. Mostramos la alerta
        setMostrarAlerta(true);

        // 2. (Opcional) Aquí podrías enviar los datos a tu base de datos ServiAT
        console.log("Reserva confirmada en el sistema");

        // 3. La ocultamos automáticamente tras 3.5 segundos
        setTimeout(() => {
            setMostrarAlerta(false);
        }, 3500);
    };


    return (
        <section className="py-4">
            <div className="container py-5 text-center">

                <div className="toast-confirmacion">
                    <div className="toast-icon-container">
                        <i className="bi bi-check-lg"></i>
                    </div>
                    <p className="toast-mensaje">¡Reserva confirmada exitosamente!</p>
                </div>

                <div className="row g-4 justify-content-center">
                    <div className="text-center mb-4">
                        <p className="py-3 text-dark">Sigue los pasos para completar tu solicitud</p>

                    </div>

                    <div className="continer d-flex justify-content-center py-5">
                        <div className="card shadow-lg border-0 rounded-4 p-4" style={{ maxWidth: '600px', width: '100%' }}>
                            <div className="card-body text-center">
                                <h2 className="card-title fw-bold mb-3">Validar tipo de servicio</h2>
                                <h6 className="card-text text-muted mb-4">Por favor revisa lo detalles de tu solicitud antes de confirmar</h6>

                                <div className="alert-border border-2 p-4 mb-4"
                                    style={{
                                        backgroundColor: '#fff9f0',
                                        borderRadius: '1rem',
                                        border: '1px solid #ffdaaa'
                                    }}
                                >
                                    <p className="fw-bold mb-3 d-flex align-items-center" style={{ color: '#f18324' }}>Resumen del servicio</p>

                                    <div className="container-fluid p-0">
                                        <div className="row g-3">
                                            <div className="col-12 col-md-6">
                                                <div className="bg-white rounded-4 p-3 shadow-sm border">
                                                    <p className="text-muted mb-1">Servicio:</p>
                                                    <p className="text-dark fw-bold mb-0">{datos.servicio}</p>

                                                </div>

                                            </div>

                                            <div className="col-12 col-md-6">
                                                <div className="bg-white rounded-4 p-3 shadow-sm border">
                                                    <p className="text-muted mb-1">Equipo:</p>
                                                    <p className="text-dark fw-bold mb-0">{datos.equipo} ({datos.categoria})</p>

                                                </div>
                                            </div>

                                            <div className="col-12 col-md-6">
                                                <div className="bg-white rounded-4 p-3 shadow-sm border">
                                                    <p className="text-muted mb-1">Fecha y hora:</p>
                                                    <p className="text-dark fw-bold mb-0">{datos.fecha} a las {datos.hora}</p>
                                                </div>

                                            </div>

                                            <div className="col-12 col-md-6">
                                                <div className="bg-white rounded-4 p-3 shadow-sm border">
                                                    <p className="text-muted mb-1">Cliente:</p>
                                                    <p className="text-dark fw-bold mb-0">{datos.nombreCliente}</p>

                                                </div>
                                            </div>

                                            <div className="col-12 col-md-6">
                                                <div className="bg-white rounded-4 p-3 shadow-sm border">
                                                    <p className="text-muted mb-1">telefono:</p>
                                                    <p className="text-dark fw-bold mb-0">{datos.telefono}</p>

                                                </div>
                                            </div>

                                            <div className="col-12 col-md-6">
                                                <div className="bg-white rounded-4 p-3 shadow-sm border">
                                                    <p className="text-muted mb-1">Modelo:</p>
                                                    <p className="text-dark fw-bold mb-0">{datos.modelo}</p>

                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <div className="bg-white rounded-4 p-3 shadow-sm border">
                                                    <p className="text-muted mb-1">Dirección:</p>
                                                    <p className="text-dark fw-bold mb-0">{datos.direccion}</p>

                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <div className="bg-white rounded-4 p-3 shadow-sm border">
                                                    <p className="text-muted mb-1">Descripción del problema:</p>
                                                    <p className="text-dark fw-bold mb-0">{datos.descripcion}</p>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                    <div className="d-flex gap-3 mt-4">
                                        {/* Botón Volver */}
                                        <button
                                            onClick={() => navigate("/Formulario")}
                                            className="btn btn-light border-2 flex-grow-1 py-3 rounded-3 shadow-sm transition-hover text-secondary"
                                            style={{
                                                transition: 'all 0.3s ease',
                                                border: '2px solid #e5e7eb'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                        >
                                            Volver a Editar
                                        </button>

                                        {/* Botón Confirmar */}
                                        <button
                                            onClick={confirmarReserva}
                                            disabled={cargando}
                                            className="btn flex-grow-1 py-3 rounded-3 fw-bold text-white shadow transition-hover border-0"
                                            style={{
                                                background: 'linear-gradient(to right, #1e3a8a, #3b82f6)',
                                                transition: 'all 0.3s ease',
                                                cursor: cargando ? 'not-allowed' : 'pointer'
                                            }}
                                            onMouseOver={(e) => {
                                                if (!cargando) {
                                                    e.currentTarget.style.transform = 'scale(1.05)';
                                                    e.currentTarget.style.filter = 'brightness(1.1)';
                                                }
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.transform = 'scale(1)';
                                                e.currentTarget.style.filter = 'brightness(1)';
                                            }}
                                        >
                                            {cargando ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Guardando...
                                                </>
                                            ) : (
                                                "Confirmar Reserva"
                                            )}

                                        </button>
                                    </div>


                                </div>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    )
}

export default ValidarInformacion;