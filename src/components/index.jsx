import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../index.css"; 

import logo from '../assets/logo.png';
import tecnico from '../assets/tecnico.jpg'

const Index = ({ alHacerClickEnLogin }) => {
    const navigate=useNavigate();
  return (
    <div className="contenedor-landing">


      <section className="seccion-principal">
        <div className="contenido-hero">

          <div>
           <div className="caja-logo-azul mb-4">
              <img 
                src={logo} 
                alt="AR Servicio Técnico" 
                className="img-fluid rounded-2" 
                style={{ maxWidth: '280px', height: 'auto' }} 
              />
            </div>
            
            <h3 className="texto-premium">⭐ SERVICIO PREMIUM 5 ESTRELLAS</h3>
            <p className="subtitulo">Reparación Profesional de Electrodomésticos</p>
            <p className="descripcion">
              Servicio técnico especializado en reparación de electrodomésticos
              industriales. ¡Rápido, eficiente y con garantía total! Técnicos certificados
              disponibles para ti.
            </p>
            
            <div className="botones-hero">
              <button onClick={()=>navigate('/InfoUsuario')} className="btn-conoce-servicios">
                📅 Conoce nuestros servicios ➔
              </button>
              <button className="btn-historial" onClick={()=>navigate('/ClienteHistorial')}>
                ⏱ Historial
              </button>
            </div>

            <a className="btn-whatsapp" href="#">
              📞 WhatsApp 3005635595
            </a>
          </div>
          
          <div className="columna-imagen">
            <img src={tecnico} alt="Técnico" className="imagen-tecnico" />
          </div>

        </div>
      </section>


      <section className="seccion-tarjetas">
  <div className="contenedor-gradiente py-5">
    <div className="container">
      {/* Añadimos d-flex y justify-content para asegurar el orden horizontal */}
      <div className="row d-flex justify-content-center g-4">
        
        {/* Tarjeta 1 */}
        <div className="col-12 col-md-4">
          <div className="card h-100 border-0 shadow-lg tarjeta-animada tarjeta-redondeada overflow-hidden">
            <div className="contenedor-imagen">
              <img 
                src="https://images.unsplash.com/photo-1696546761269-a8f9d2b80512?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" 
                className="imagen-zoom cover-img" 
                alt="Reparación" 
              />
              <div className="card-img-overlay d-flex flex-column justify-content-end p-4 overlay-negro">
                <h3 className="text-white h5 mb-2">Reparación de electrodomésticos</h3>
                <p className="text-white-50 small mb-3">Servicio especializado</p>
                <button onClick={()=>navigate('/infoUsuario')} className="btn btn-glass w-fit">Agendar servicio</button>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta 2 */}
        <div className="col-12 col-md-4">
          <div className="card h-100 border-0 shadow-lg tarjeta-animada tarjeta-redondeada overflow-hidden">
            <div className="contenedor-imagen">
              <img 
                src="https://images.unsplash.com/photo-1759434775823-40d8b9577a41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" 
                className="imagen-zoom cover-img" 
                alt="Servicio" 
              />
              <div className="card-img-overlay d-flex flex-column justify-content-end p-4 overlay-negro">
                <h3 className="text-white h5 mb-2">Servicio Especializado</h3>
                <p className="text-white-50 small mb-3">Técnicos profesionales</p>
                <button onClick={()=>navigate('/ServiciosNav')} className="btn btn-glass w-fit">Consultar ahora</button>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta 3 */}
        <div className="col-12 col-md-4">
          <div className="card h-100 border-0 shadow-lg tarjeta-animada tarjeta-redondeada overflow-hidden">
            <div className="contenedor-imagen">
              <img 
                src="https://images.unsplash.com/photo-1762329924239-e204f101fca4?crop=entropy=108" 
                className="imagen-zoom cover-img" 
                alt="Industriales" 
              />
              <div className="card-img-overlay d-flex flex-column justify-content-end p-4 overlay-negro">
                <h3 className="text-white h5 mb-2">Equipos Industriales</h3>
                <p className="text-white-50 small mb-3">Alta capacidad</p>
                <button onClick={()=>navigate('/infoUsuario')}  className="btn btn-glass w-fit">Ver servicios</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</section>

<section className="seccion-final">
        <h4>Expertos en Reparación</h4>
        <p>Profesionales dedicados a brindar el mejor servicio de reparación</p>
        <button onClick={()=>navigate('/infoUsuario')} className="btn-solicitar-final">
          Solicitar Servicio Ahora
        </button>
      </section>

 
    </div>
  );
};

export default Index;