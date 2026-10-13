import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function ServicioConfirmado(){
    const navigate=useNavigate();
    const location=useLocation();
    const tecnicoNombre = "Fabio Alexander Rojas Lara";

    const datos=location.state;
    console.log("Datos recibidos en confirmación:", location.state);

    if (!location.state) {
        return (
            <div className="container py-5 text-center">
                <h2>No hay datos de reserva activos</h2>
                <button className="btn btn-primary" onClick={() => navigate("/Formulario")}>Ir al formulario</button>
            </div>
        );
    }
    return(
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
                            <i class="bi bi-check" style={{
                                 fontSize:'48px',
                                 color:'#1abc9c',
                                 display:'block'
                            }}>

                            </i>

                        </div>
                        
                        <p className="py-3" 
                        style={{
                            fontSize:'28px',
                            color:'#1abc9c',
                            margin:'0',
                            lineHeight:'1.2'
                        }}>
                            ¡Reserva confirmada!
                            </p>

                    </div>

                    <div className="continer d-flex justify-content-center py-5">
                        <div className="card shadow-lg border-0 rounded-4 p-4" style={{maxWidth:'600px',width:'100%'}}>
                            <div className="card-body text-center">
                                <h2 className="card-title fw-bold mb-3">Validar tipo de servicio</h2>
                                <h6 className="card-text text-muted mb-4">Por favor revisa lo detalles de tu solicitud antes de confirmar</h6>

                                <div className="alert-border border-2 p-4 mb-4"
                                style={{
                                    backgroundColor: '#f2d2d2',
                                    borderRadius:'1rem',
                                    border:'1px solid #f2d2d2'
                                }}
                                >
                                    <p className="fw-bold mb-3 d-flex align-items-center text-start" style={{color: '#fe1515', fontWeight: '500'}}>Resumen del servicio</p>
                                    
                                    <div className="container-fluid p-0">
                                        <div className="row g-4 text-start">
                        
                                                <div className="col-12 col-md-6">
                                                    <p className="text-muted mb-1">Fecha y hora:</p>
                                                    <p className="text-dark  fw-normal">{datos.fecha} a las {datos.hora}</p>
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <p className="text-muted mb-1">Cliente:</p>
                                                    <p className="text-dark fw-normal text-uppercase">{datos.nombreCliente}</p>
                                                </div>

                                                 

                                                  <div className="col-12 col-md-6">
                                                    <p className="text-muted mb-1">Servicio:</p>
                                                    <p className="text-dark fw-normal">{datos.servicio}</p>                   
                                                  </div>

                                                   <div className="col-12 col-md-6">
                                                        <p className="text-muted mb-1">telefono:</p>
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
                                                    <p className="text-muted mb-1">Correo electronico:</p>
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
                                     <p className="fw-bold mb-3  d-flex text-primary">Información del Técnico</p> 
                                     <p className="fw-bold mb-3  text-center text-primary">Técnico disponible</p> 
                                
                                    <ul className="list-unstyled mb-0" style={{ fontSize: '0.95rem' }}>
                                        <li className="mb-2">Nombre: <br />{tecnicoNombre}</li>
                                    </ul>

                                    
                                    </div>
                                </div>

                                   <div className="d-flex gap-3 mt-4 justify-content-center">
                                    <button 
                                        onClick={() => navigate("/Formulario")} 
                                        className="btn btn-continuar py-3 px-5 rounded-3 fw-bold shadow"
                                         style={{ transition: 'transform 0.3s'}}
                                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                       <p className="text-center" style={{ color: 'rgb(246, 246, 246)' }}>  Hacer otra reserva</p>
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