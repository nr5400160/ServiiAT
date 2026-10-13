import '../App.css';
function ServiciosNav(){

    return(
     <section className="py-4">
        <div className="container py-5">
      <div className="row g-4">
          <div className="col-md-6">
            <div className="card h-100 border-0 custom-card p-4">
              <div className="card-body">
                <div className="icon-box mb-4 icon-blue">
                   <span className="fs-3 text-white"><i className="bi bi-gear-fill"></i></span>
                </div>

                <h4 className="card-title fw-bold mb-3" style={{ color: '#002b5c' }}>
                  Instalación Profesional HORECA
                </h4>

                <p className="card-text text-secondary mb-4">
                  Realizamos la puesta en marcha técnica de equipos <br />
                   de cocina industrial, refrigeración y lavado,  <br />
                   asegurando el cumplimiento de normativas de <br />
                    seguridad y optimización energética para que tu <br />
                     negocio nunca se detenga.
                </p>

                <a href={'/infoUsuario'} className="text-decoration-none fw-bold d-flex align-items-center">
                  Solicitar este servicio 
                  <span className="ms-2">›</span>
                </a>
              </div>

              </div>
            </div>
               <div className="col-md-6">
                <div className="card h-100 border-0 custom-card p-4">
                  <div className="card-body">
                    <div className="icon-box mb-4 icon-red">
                      <span className="fs-3 text-white"><i className="bi bi-wrench-adjustable"></i></span>
                    </div>

                    <h4 className="card-title fw-bold mb-3" style={{ color: '#002b5c' }}>
                      Reparación Especializada HORECA
                    </h4>

                    <p className="card-text text-secondary mb-4">
                      Servicio técnico de urgencia y correctivo <br />
                      para maquinaria pesada. Diagnosticamos <br />
                        y reparamos fallos en hornos, cámaras frigoríficas y <br />
                        lavavajillas industriales etc.
                    </p>

                    <a href={'/infoUsuario'} className="text-decoration-none fw-bold d-flex align-items-center">
                      Solicitar este servicio 
                      <span className="ms-2">›</span>
                    </a>
                  </div>
                  </div>
                </div>
          </div>
          

      </div>

                

        </section>

)

}

export default ServiciosNav;