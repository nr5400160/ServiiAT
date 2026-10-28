import React from 'react';
function Footer() {
  const tecnicoCelular = "3005635595";
  const tecnicoNombre = "Fabio Alexander Rojas Lara";
  const currentYear = new Date().getFullYear();

  const clickBoton = () => {
    window.open(`https://wa.me/57${technicianPhone}?text=Hola%20${encodeURIComponent(technicianName)},%20necesito%20información`, '_blank');
  };

  return (
    <footer 
      className="text-white py-5" 
      style={{ 
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)' 
      }}
    >
      <div className="container">
        <div className="d-flex flex-column align-items-center text-center">
          
          {/* Información de la Empresa */}
          <div className="mb-4">
            <h2 className="fw-bold display-6">AR SERVICIO TÉCNICO</h2>
            <p className="lead mx-auto" style={{ maxWidth: '700px', color: '#e0e7ff' }}>
              Servicios de reparaciones y instalaciones de electrodomésticos en el sector HORECA.
              Especialistas en equipos industriales y domésticos.
            </p>
          </div>


          <div className="mb-4">
            <button 
              onClick={clickBoton}
              className="btn btn-lg rounded-pill px-4 py-3 shadow-lg d-flex align-items-center gap-2 border-0"
              style={{ transition: 'transform 0.3s', backgroundColor:'#25D366'}}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <i className="bi bi-whatsapp fs-4"style={{color:'rgba(255, 255, 255, 0.8)'}} ></i>
              <span className="fw-bold" style={{color:'rgb(255, 255, 255)'}}>WhatsApp: {tecnicoCelular}</span>
            </button>
          </div>

          <div className="border-top border-white border-opacity-25 pt-4 mt-4 w-100">
            <p className="small mb-0" style={{ color: 'rgb(255, 255, 255)' }}>
              © {currentYear} AR SERVICIO TÉCNICO - Todos los derechos reservados - {tecnicoNombre}
            </p>
          </div>
          
        </div>
      </div>
    </footer>
  );
}

export default Footer;