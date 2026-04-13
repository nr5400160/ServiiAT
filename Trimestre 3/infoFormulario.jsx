import { useNavigate } from "react-router-dom";
function InformacionPaso1(){
    const navigate=useNavigate();

    return(
        <section className="py-4">
            <div className="container py-5 text-center">
                <div className="row g-4 justify-content-center">
                <div className="text-center mb-4">
                    <p className="py-3 text-dark">Sigue los pasos para completar tu solitud de servicio</p>
                </div>

          
                    


              <div className="container d-flex justify-content-center py-5">
                <div className="card shadow-lg border-0 rounded-4 p-4" style={{ maxWidth: "600px", width: "100%" }}>

                    <div className="card-body text-center">
                        <h6 className="card-title fw-bold mb-3">Registrar solictud de servicio</h6>
                        <p className="card-text text-muted mb-4">
                        Estas a punto de de solicitar un servicio. Haz click en continuar para 
                        proceder.
                        </p>

                      
                            <div className="alert border border-primary border-2 p-4 mb-4" style={{ backgroundColor: '#eff6ff', borderRadius: '0.75rem' }}>
                                <p className="fw-bold mb-3 d-flex align-items-center text-secondary">Información importante</p> 
                                
                                <ul className="list-unstyled mb-0" style={{ fontSize: '0.95rem' }}>
                                <li className="mb-2">•Asegúrate de tener la información del electrodoméstico</li>
                                <li className="mb-2">•Prepara tu dirección completa para la visita</li>
                                <li className="mb-2">•Ten a mano tu número de teléfono</li>
                                <li className="mb-2">•Revisa los horarios disponibles antes de agendar</li>
                                </ul>
                            </div>
                       
                        <button onClick={()=>navigate("/Formulario")} 
                        className="btn btn-continuar w-100 py-2 rounded-3 fw-bold shadow-sm"
                        style={{ transition: 'transform 0.3s'}}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <p className="text-center" style={{ color: 'rgb(255, 255, 255)' }}>Continuar al Siguiente Paso</p>
                        </button>

                    </div>

                
                </div>
            </div>


            

            </div>   
            </div>

        </section>
    )

}

export default InformacionPaso1;