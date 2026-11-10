import React, { useEffect, useState } from "react";
import "../index.css"; 

function HistorialVersiones() {
  const [versiones, setVersiones] = useState([]);
  const [filtro, setFiltro] = useState("Todos");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerHistorial();
  }, []);

  async function obtenerHistorial() {
    console.log("📍 PASO 1: Iniciando petición al backend...");
    try {
      setCargando(true);
      
      const respuesta = await fetch("http://localhost:3001/api/admin/solicitudes");
      console.log("📍 PASO 2: Respuesta recibida. Status:", respuesta.status);
      
      if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`);
      }

      const data = await respuesta.json();
      console.log("📍 PASO 3: Datos JSON puros convertidos:", data);

      if (!Array.isArray(data)) {
        console.error("❌ ERROR: Los datos recibidos no son una lista (array).", data);
        return;
      }

      const datosAdaptados = data.map((item) => ({
        id: item.id_solicitud,
        version: item.nombre_equipo || "Equipo no especificado",
        fecha: item.fecha_solicitud || "Sin fecha",
        descripcion: item.descripcion || "Sin descripción",
        estado: item.nombre_estado || "Pendiente",
        direccion: item.direccion_servicio || "Sin dirección",
        cliente: `${item.nombre_1 || ""} ${item.apellido_1 || ""}`.trim() || "Cliente Anónimo",
        marca: item.marca_equipo !== "No especificada" ? item.marca_equipo : "",
      }));

      console.log("📍 PASO 4: Datos adaptados correctamente:", datosAdaptados);
      setVersiones(datosAdaptados);
      
    } catch (error) {
      console.error("❌ ERROR GRAVE EN LA PETICIÓN:", error);
    } finally {
      console.log("📍 PASO 5: Proceso terminado. Cargando en false.");
      setCargando(false);
    }
  }

  const datosFiltrados = filtro === "Todos"
    ? versiones
    : versiones.filter((item) => item.estado === filtro);

  return (
    <div className="historial-container p-3 w-100">
      <div className="historial-header mb-4">
        <h2 style={{ color: '#0d47a1', borderBottom: '2px solid #0d47a1', paddingBottom: '10px' }}>
          Historial de Solicitudes
        </h2>
      </div>

      <div className="mb-4 d-flex gap-2 flex-wrap">
        <button onClick={() => setFiltro("Todos")} className={`btn ${filtro === "Todos" ? "btn-primary" : "btn-outline-primary"}`}>
          Todos ({versiones.length})
        </button>
        <button onClick={() => setFiltro("Pendiente")} className={`btn ${filtro === "Pendiente" ? "btn-warning text-dark" : "btn-outline-warning"}`}>
          Pendiente ({versiones.filter(v => v.estado === "Pendiente").length})
        </button>
        <button onClick={() => setFiltro("En proceso")} className={`btn ${filtro === "En proceso" ? "btn-info text-white" : "btn-outline-info"}`}>
          En proceso ({versiones.filter(v => v.estado === "En proceso").length})
        </button>
        <button onClick={() => setFiltro("Finalizado")} className={`btn ${filtro === "Finalizado" ? "btn-success" : "btn-outline-success"}`}>
          Finalizado ({versiones.filter(v => v.estado === "Finalizado").length})
        </button>
        <button onClick={() => setFiltro("Cancelado")} className={`btn ${filtro === "Cancelado" ? "btn-danger" : "btn-outline-danger"}`}>
          Cancelado ({versiones.filter(v => v.estado === "Cancelado").length})
        </button>
      </div>

      {cargando ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2 text-muted">Cargando historial...</p>
        </div>
      ) : datosFiltrados.length === 0 ? (
        <div className="alert alert-info text-center shadow-sm">
          No hay solicitudes para mostrar.
        </div>
      ) : (
        <div className="row g-3">
          {datosFiltrados.map((item) => (
            <div key={item.id} className="col-12 col-md-6 col-lg-4">
              <div className="card shadow-sm h-100 border-0" style={{ borderRadius: "10px", backgroundColor: "#fff" }}>
                <div className="card-body">
                  <h5 className="card-title fw-bold text-primary">{item.version}</h5>
                  <span className="badge bg-secondary mb-2">{item.estado}</span>
                  <h6 className="card-subtitle mb-2 text-muted">{item.fecha}</h6>
                  <p className="card-text small">{item.descripcion}</p>
                  <hr/>
                  <p className="mb-0 small"><strong>Cliente:</strong> {item.cliente}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistorialVersiones;