import '../App.css';
import { Award, Zap, Heart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import imagentecnico from '../assets/imagentecnico.png';
import tecnico1 from '../assets/tecnico1.png';
function AcercaDeNosotros() {
  const navigate = useNavigate();

  return (
    <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 50%, #eef2ff 100%)' }}>

      {/* contenido principal */}
      <div className="container py-5">

        <div className="row align-items-center mb-5 g-5">
          <div className="col-lg-6">
            <h2 className="display-6 fw-bold mb-4" style={{ color: '#1e3a8a' }}>Nuestra Misión</h2>
            <p className="lead text-muted mb-4">
              ¡Reparamos electrodomésticos de uso industrial de manera rápida, eficiente y con confianza.
              Contamos con técnicos especializados en neveras, estufas, hornos y equipos de gran capacidad
              para negocios y empresas!
            </p>
            <p className="text-secondary mb-4">
              Nuestro objetivo es brindar soluciones técnicas de alta calidad que permitan a nuestros clientes
              mantener sus operaciones funcionando sin interrupciones, con la confianza de un servicio profesional
              y garantizado.
            </p>
          </div>

          <div className="col-lg-6 position-relative">
            <div className="hover-zoom">
              <img
                src={tecnico1}
                alt="Técnico profesional reparando lavadora"
                className="img-fluid rounded-4 shadow-lg w-100"
                style={{ height: '400px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="card h-100 text-center p-4 border-light shadow-sm custom-card-hover">
              <div className="rounded-circle bg-warning bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '64px', height: '64px' }}>
                <Award className="text-warning" size={32} />
              </div>
              <h3 className="h5 fw-bold text-warning mb-2">10+ Años</h3>
              <p className="text-muted mb-0">De Experiencia</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 text-center p-4 border-light shadow-sm custom-card-hover">
              <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '64px', height: '64px' }}>
                <Zap className="text-primary" size={32} />
              </div>
              <h3 className="h5 fw-bold text-primary mb-2">24/7</h3>
              <p className="text-muted mb-0">Servicio Disponible</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 text-center p-4 border-light shadow-sm custom-card-hover">
              <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '64px', height: '64px' }}>
                <Heart className="text-success" size={32} />
              </div>
              <h3 className="h5 fw-bold text-success mb-2">100%</h3>
              <p className="text-muted mb-0">Garantía</p>
            </div>
          </div>
        </div>

        <div className="card shadow-lg p-4 p-md-5 mb-5 border-0 rounded-4">
          <h2 className="text-center mb-5 fw-bold text-dark">Nuestros Servicios Especializados</h2>
          <div className="row g-4">

            <div className="col-md-6">
              <div className="p-4 rounded-3 h-100 border-start border-4 border-primary shadow-sm" style={{ background: 'linear-gradient(to right, #eff6ff, #f5f3ff)' }}>
                <h3 className="h5 fw-bold text-primary mb-3">Equipos Industriales HORECA</h3>
                <p className="text-primary small fw-bold text-uppercase ls-wide mb-2">Servicio Principal</p>
                <ul className="list-unstyled text-muted mb-4">
                  <li>• Reparación e instalación de cocinas industriales</li>
                  <li>• Mantenimiento de hornos de convección y freidoras</li>
                  <li>• Servicio técnico para lavavajillas comerciales</li>
                  <li>• Equipos de refrigeración para hoteles y restaurantes</li>
                </ul>
                <button onClick={() => navigate("/infoUsuario")} className="btn btn-link p-0 text-decoration-none fw-bold d-flex align-items-center gap-1" style={{ color: '#1e3a8a' }}>
                  Solicitar servicio <ArrowRight size={16} />
                </button>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-4 rounded-3 h-100 border-start border-4 border-info shadow-sm" style={{ background: 'linear-gradient(to right, #f8fafc, #eff6ff)' }}>
                <h3 className="h5 fw-bold text-dark mb-3">Refrigeración Comercial</h3>
                <p className="text-info small fw-bold text-uppercase ls-wide mb-2">Especialidad</p>
                <ul className="list-unstyled text-muted mb-4">
                  <li>• Cavas de congelación y cuartos fríos</li>
                  <li>• Vitrinas refrigeradas y exhibidores</li>
                  <li>• Máquinas de hielo industriales</li>
                  <li>• Recarga de refrigerante y sellado de fugas</li>
                </ul>
                <button onClick={() => navigate("/infoUsuario")} className="btn btn-link p-0 text-decoration-none fw-bold text-info d-flex align-items-center gap-1">
                  Solicitar servicio <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>


        <div className="card shadow-lg p-4 p-md-5 border-0 rounded-4 mb-5">
          <div className="row align-items-center mb-5">
            <div className="col-lg-7">
              <h2 className="fw-bold text-dark mb-4">Nuestra Visión</h2>
              <p className="lead text-secondary mb-4">
                Ser la empresa líder en servicios técnicos de electrodomésticos industriales,
                reconocida por nuestra excelencia, rapidez y compromiso inquebrantable.
              </p>
              <p className="text-muted mb-4">
                Aspiramos a expandir nuestros servicios y convertirnos en el socio de confianza
                preferido para empresas y negocios de alta capacidad.
              </p>
            </div>
            <div className="col-lg-5">
              <div className="position-relative">
                <img
                  src={imagentecnico}
                  alt="Visión"
                  className="img-fluid rounded-4 shadow-sm border border-4 border-white"
                  style={{ height: '300px', width: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>

          <div
            className="rounded-4 p-4 p-md-5 text-white shadow-lg"
            style={{ background: 'linear-gradient(to right, #1e3a8a, #3b82f6)' }}
          >
            <div className="row align-items-center">
              <div className="col-lg-7 text-center text-lg-start mb-4 mb-lg-0">
                <h3 className="fw-bold mb-2">¡Únete a Nuestro Equipo!</h3>
                <p className="mb-0 opacity-75">
                  Estamos buscando técnicos certificados. Si tienes experiencia en reparación industrial, queremos conocerte.
                </p>
              </div>
              <div className="col-lg-5 d-flex flex-wrap justify-content-center gap-2">
                <span className="badge rounded-pill bg-white bg-opacity-25 p-2 px-3 border border-white border-opacity-25">✓ Capacitación</span>
                <span className="badge rounded-pill bg-white bg-opacity-25 p-2 px-3 border border-white border-opacity-25">✓ Ambiente Pro</span>
                <span className="badge rounded-pill bg-white bg-opacity-25 p-2 px-3 border border-white border-opacity-25">✓ Crecimiento</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .custom-card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .custom-card-hover:hover {
          transform: translateY(-10px);
          box-shadow: 0 1rem 3rem rgba(0,0,0,.175)!important;
        }
        .hover-zoom img {
          transition: transform 0.5s ease;
        }
        .hover-zoom:hover img {
          transform: scale(1.05);
        }
        .ls-wide {
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  );

}

export default AcercaDeNosotros;