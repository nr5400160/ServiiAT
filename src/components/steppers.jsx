import { useLocation } from "react-router-dom";

const Stepper=()=>{
    const localizacion=useLocation();

    const pasosPaths=["/","/Formulario","/ValidarInformacion"];
    let pasoActual=pasosPaths.indexOf(localizacion.pathname);
    if (localizacion.pathname === "/") pasoActual = 0;

    const pasos=[
        {label:"Registrar solictud",icon:"bi bi-file-earmark-text"},
        {label:"Ingresa información",icon:"bi bi-info-circle "},
        {label:"Validar servicio",icon:"bi bi-clipboard-check"}
    ];

    const estiloIconos = (isCompleted, isActive) => {
        if (isCompleted) {
            // Degradado verde (como el de la primera imagen)
            return 'linear-gradient(135deg, #10b981 0%, #059669 100%)'; 
        } else if (isActive) {
            // Degradado azul (como el de la primera imagen)
            return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
        }
        // Fondo blanco si está inactivo
        return '#ffffff';
    };

    return(

        <div className="row g-4 justify-content-center py-4">
        {pasos.map((step, index) => {
             const isCompleted = index < pasoActual;
             const isActive = index === pasoActual;

            return(
        
            <div key={index} className="col-6 col-md-3">
                <div className={`d-flex flex-column align-items-center ${!isActive && !isCompleted ? 'opacity-50' : ''}`}>
                    <div className={`p-4 rounded-4 shadow-sm mb-3 fs-1 d-flex align-items-center justify-content-center transition-all`}
                    style={{
                        width:'80px',height:'80px',
                        background: estiloIconos(isCompleted,isActive),
                        color:(isActive || isCompleted)? '#ffff':'#6c757d',
                        border: isActive || isCompleted ? 'none':'1px solid #dee2e6'


                    }}
                    >

                        <i className={`bi ${isCompleted ? 'bi-check-circle' : step.icon}`}></i>

                    </div>
                    <p className={`text-center ${isActive ? 'fw-bold text-dark' : 'text-secondary'}`} style={{fontSize:'0.9rem'}}>
                        {step.label}
                    </p>

                </div>

            </div>
            );
         })}
    </div>
  );
};

export default Stepper;