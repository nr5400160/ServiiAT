import React, { useState, useEffect } from "react";
import "../index.css";

const ClienteDashboard = () => {
  const [misSolicitudes, setMisSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorLocal, setErrorLocal] = useState("");

  useEffect(() => {
    obtenerMiHistorial();
  }, []);

  async function obtenerMiHistorial() {
    setCargando(true);
    setErrorLocal("");

    // ACTUALIZADO: Ahora busca correctamente en sessionStorage
    const idUsuario = sessionStorage.getItem("id_usuario"); 

    if (!idUsuario) {
      setErrorLocal("No se encontró tu sesión. Por favor, vuelve a iniciar sesión.");
      setCargando(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/cliente/solicitudes/${idUsuario}`);
      
      if (!res.ok) throw new Error("Error al obtener los datos del servidor.");
      
      const data = await res.json();
      setMisSolicitudes(data);
    } catch (error) {
      console.error("Error:", error);
      setErrorLocal("Ocurrió un problema al conectar con el historial.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="container p-4 mt-3">
      <div className="mb-4 text-center">
        <h2 style={{ color: '#0d47a1', fontWeight: 'bold' }}>
          {/* ACTUALIZADO: Título e ícono cambiados a Historial */}
          <i className="bi bi-clock-history me-2"></i> Mi Historial
        </h2>
        <p className="text-muted">Aquí puedes rastrear el estado de tus servicios técnicos.</p>
      </div>

      {errorLocal && (
        <div className="alert alert-danger text-center shadow-sm">
          <i className="bi bi-exclamation-triangle-fill me-2"></i> {errorLocal}
        </div>
      )}

      {cargando ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Cargando tu historial...</p>
        </div>
      ) : misSolicitudes.length === 0 && !errorLocal ? (
        <div className="alert alert-info text-center shadow-sm p-4">
          <i className="bi bi-info-circle fs-1 d-block mb-3"></i>
          <h5>Aún no tienes solicitudes registradas</h5>
          <p className="mb-0">Cuando solicites un servicio técnico, aparecerá aquí.</p>
        </div>
      ) : (
        <div className="row g-4">
          {misSolicitudes.map((item) => (
            <div key={item.id_solicitud} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0" style={{ borderRadius: "12px", overflow: "hidden" }}>
                
                <div className={`text-white text-center py-2 ${
                  item.nombre_estado === 'Pendiente' ? 'bg-warning text-dark' :
                  item.nombre_estado === 'En proceso' ? 'bg-info text-white' :
                  item.nombre_estado === 'Finalizado' ? 'bg-success' : 'bg-danger'
                }`}>
                  <h6 className="m-0 fw-bold">{item.nombre_estado.toUpperCase()}</h6>
                </div>

                <div className="card-body bg-white">
                  <h5 className="card-title fw-bold text-dark mb-1">
                    {item.nombre_equipo} {item.marca_equipo && item.marca_equipo !== "No especificada" ? `(${item.marca_equipo})` : ""}
                  </h5>
                  <p className="text-muted small mb-3">
                    <i className="bi bi-calendar me-1"></i> Solicitado el: {item.fecha_solicitud}
                  </p>
                  
                  <div className="bg-light p-3 rounded mb-0">
                    <p className="small mb-1 fw-bold text-secondary">Problema:</p>
                    <p className="small mb-0 text-dark" style={{ fontStyle: "italic" }}>"{item.descripcion}"</p>
                  </div>
                </div>

                <div className="card-footer bg-white border-0 pt-0 pb-3">
                  <p className="small text-muted mb-0 mt-2">
                    <i className="bi bi-geo-alt-fill me-1"></i> {item.direccion_servicio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClienteDashboard;