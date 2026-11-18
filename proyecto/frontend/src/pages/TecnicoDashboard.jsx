import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import "../index.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const TecnicoDashboard = () => {
  const navigate = useNavigate(); // 1. Inicializamos la navegación
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");
  const [tabActiva, setTabActiva] = useState("Nuevas"); 
  const [precios, setPrecios] = useState({});
  const [guardandoPrecioId, setGuardandoPrecioId] = useState(null);

  // 2. Función para cerrar sesión
  const cerrarSesion = () => {
    sessionStorage.clear(); 
    
    // En lugar de usar navigate, usamos window.location.href
    // Esto redirige y fuerza un refresco de la página al mismo tiempo
    window.location.href = '/'; 
  };

  const obtenerSolicitudes = useCallback(async ({ mostrarCarga = true } = {}) => {
    if (mostrarCarga) setCargando(true);
    try {
      const res = await fetch(`${API_URL}/api/tecnico/solicitudes`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.detalle || `Error al cargar solicitudes (${res.status}).`);
      }
      if (!Array.isArray(data)) {
        throw new Error("El servidor devolvió una respuesta inválida al cargar las solicitudes.");
      }
      
      const datosAdaptados = data.map((item) => ({
        id: item.id_solicitud,
        equipo: item.nombre_equipo || "Equipo no especificado",
        fecha: item.fecha_solicitud || "Sin fecha",
        descripcion: item.descripcion || "Sin descripción",
        estado: item.nombre_estado || "Pendiente",
        direccion: item.direccion_servicio || "Sin dirección",
        cliente: `${item.nombre_1 || ""} ${item.apellido_1 || ""}`.trim(),
        marca: item.marca_equipo !== "No especificada" ? item.marca_equipo : "",
        precio: item.precio_servicio,
        pagado: item.pagado,
      }));

      setErrorCarga("");
      setSolicitudes(datosAdaptados);
      setPrecios((prev) => {
        const siguientes = { ...prev };
        for (const item of datosAdaptados) {
          if (item.precio !== null && item.precio !== undefined) {
            siguientes[item.id] = String(item.precio);
          }
        }
        return siguientes;
      });
    } catch (error) {
      console.error("Error al obtener solicitudes:", error);
      setErrorCarga(error.message || "No se pudieron cargar las solicitudes.");
    } finally {
      if (mostrarCarga) setCargando(false);
    }
  }, []);

  useEffect(() => {
    obtenerSolicitudes();
    const intervalo = window.setInterval(
      () => obtenerSolicitudes({ mostrarCarga: false }),
      30000
    );
    return () => window.clearInterval(intervalo);
  }, [obtenerSolicitudes]);

  async function cambiarEstadoTrabajo(id, nombreEstado) {
    try {
      const res = await fetch(`${API_URL}/api/tecnico/solicitudes/${id}/estado`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`
        },
        body: JSON.stringify({ nombre_estado: nombreEstado })
      });
      const resultado = await res.json();
      if (!res.ok) throw new Error(resultado.error || "No se pudo actualizar el estado.");

      setSolicitudes((prev) => 
        prev.map((item) => 
          item.id === id ? { ...item, estado: nombreEstado } : item
        )
      );
      if (nombreEstado === "En proceso" || nombreEstado === "Cancelado") {
        setTabActiva("Historial");
      }

      alert(nombreEstado === "En proceso" ? "¡Trabajo Aceptado!" : `Marcado como ${nombreEstado}`);
    } catch (error) {
      alert(error.message || "No se pudo cambiar el estado del trabajo.");
    }
  }

  async function guardarPrecio(item) {
    const valor = Number(precios[item.id]);
    if (!Number.isFinite(valor) || valor <= 0) {
      alert("Ingresa un precio mayor que cero en pesos colombianos.");
      return;
    }

    setGuardandoPrecioId(item.id);
    try {
      const res = await fetch(`${API_URL}/api/tecnico/solicitudes/${item.id}/precio`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`
        },
        body: JSON.stringify({ precio_servicio: valor })
      });
      const resultado = await res.json();
      if (!res.ok) throw new Error(resultado.error || "No se pudo guardar el precio.");

      setSolicitudes((prev) => prev.map((solicitud) => (
        solicitud.id === item.id
          ? { ...solicitud, precio: resultado.precio_servicio }
          : solicitud
      )));
      setPrecios((prev) => ({ ...prev, [item.id]: String(resultado.precio_servicio) }));
      alert("Precio guardado. Ya aparece en el historial del cliente.");
    } catch (error) {
      alert(error.message || "No se pudo guardar el precio.");
    } finally {
      setGuardandoPrecioId(null);
    }
  }

  const solicitudesNuevas = solicitudes.filter(s => s.estado === "Pendiente");
  const solicitudesHistorial = solicitudes.filter(s => s.estado === "En proceso" || s.estado === "Finalizado" || s.estado === "Cancelado");

  return (
    <div className="container p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: '#0d47a1', fontWeight: 'bold' }}>
          <i className="bi bi-tools me-2"></i> Panel de Técnico
        </h2>
        
        {/* 3. Contenedor para el badge y el botón de cerrar sesión */}
        <div className="d-flex align-items-center gap-3">
          <button
            type="button"
            onClick={obtenerSolicitudes}
            className="btn btn-outline-secondary btn-sm fw-bold"
            disabled={cargando}
          >
            <i className={`bi ${cargando ? "bi-arrow-repeat" : "bi-arrow-clockwise"} me-1`} aria-hidden="true"></i>
            Actualizar
          </button>
          <button
            onClick={() => navigate("/perfil")}
            className="btn btn-outline-primary btn-sm fw-bold"
          >
            <i className="bi bi-person-gear me-1"></i> Mi perfil
          </button>
          <span className="badge bg-primary fs-6">Modo Operativo</span>
          <button 
            onClick={cerrarSesion} 
            className="btn btn-danger btn-sm fw-bold shadow-sm"
          >
            <i className="bi bi-box-arrow-right me-1"></i> Cerrar Sesión
          </button>
        </div>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${tabActiva === "Nuevas" ? "active fw-bold" : "text-muted"}`} 
            onClick={() => setTabActiva("Nuevas")}
            style={tabActiva === "Nuevas" ? { color: '#0d47a1', borderBottom: '3px solid #0d47a1' } : {}}
          >
            Nuevas Solicitudes <span className="badge bg-danger rounded-pill ms-1">{solicitudesNuevas.length}</span>
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${tabActiva === "Historial" ? "active fw-bold" : "text-muted"}`} 
            onClick={() => setTabActiva("Historial")}
            style={tabActiva === "Historial" ? { color: '#0d47a1', borderBottom: '3px solid #0d47a1' } : {}}
          >
            Mis Trabajos (Historial)
          </button>
        </li>
      </ul>

      {cargando ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Buscando trabajos...</p>
        </div>
      ) : errorCarga ? (
        <div className="alert alert-danger" role="alert">
          <p className="mb-2">{errorCarga}</p>
          <button type="button" className="btn btn-outline-danger btn-sm" onClick={obtenerSolicitudes}>
            Reintentar
          </button>
        </div>
      ) : (
        <div className="row g-4">
          
          {tabActiva === "Nuevas" && (
            solicitudesNuevas.length === 0 ? (
              <div className="alert alert-info text-center w-100 mt-4 shadow-sm">
                <i className="bi bi-cup-hot fs-4 d-block mb-2"></i>
                No hay trabajos pendientes en este momento.
              </div>
            ) : (
              solicitudesNuevas.map((item) => (
                <div key={item.id} className="col-12 col-lg-6">
                  <div className="card shadow-sm border-0 border-start border-warning border-4 h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-2">
                        <h5 className="fw-bold text-dark mb-0">{item.equipo}</h5>
                        <span className="badge bg-warning text-dark">Nuevo</span>
                      </div>
                      <p className="text-muted small mb-3"><i className="bi bi-clock"></i> {item.fecha}</p>
                      
                      <div className="bg-light p-2 rounded mb-3">
                        <p className="mb-0 small fw-bold text-danger">Problema reportado:</p>
                        <p className="mb-0 small">{item.descripcion}</p>
                      </div>

                      <p className="small mb-1"><strong><i className="bi bi-person"></i> Cliente:</strong> {item.cliente}</p>
                      <p className="small mb-3"><strong><i className="bi bi-geo-alt"></i> Dirección:</strong> {item.direccion}</p>
                      
                      <div className="d-flex gap-2 mt-auto">
                        <button 
                          className="btn btn-success w-50 fw-bold"
                          onClick={() => cambiarEstadoTrabajo(item.id, "En proceso")}
                        >
                          <i className="bi bi-check-circle me-1"></i> Aceptar
                        </button>
                        <button 
                          className="btn btn-outline-danger w-50"
                          onClick={() => cambiarEstadoTrabajo(item.id, "Cancelado")}
                        >
                          Rechazar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )
          )}

          {tabActiva === "Historial" && (
            solicitudesHistorial.length === 0 ? (
              <div className="alert alert-light text-center w-100 mt-4 border shadow-sm">
                Aún no tienes trabajos en tu historial.
              </div>
            ) : (
              solicitudesHistorial.map((item) => (
                <div key={item.id} className="col-12 col-lg-6">
                  <div className={`card shadow-sm border-0 border-start border-4 h-100 ${item.estado === 'En proceso' ? 'border-info' : item.estado === 'Finalizado' ? 'border-success' : 'border-secondary'}`}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-3">
                        <h5 className="fw-bold text-dark mb-0">{item.equipo} {item.marca && `(${item.marca})`}</h5>
                        <span className={`badge ${item.estado === 'En proceso' ? 'bg-info text-white' : item.estado === 'Finalizado' ? 'bg-success' : 'bg-secondary'}`}>
                          {item.estado}
                        </span>
                      </div>
                      
                      <p className="small mb-1"><strong>Cliente:</strong> {item.cliente}</p>
                      <p className="small mb-1"><strong>Dirección:</strong> {item.direccion}</p>
                      <p className="small mb-3 text-muted"><strong>Reporte:</strong> {item.descripcion}</p>

                      {(item.estado === "En proceso" || item.estado === "Finalizado") && (
                        item.pagado ? (
                          <div className="alert alert-success py-2 mb-3">
                            Pago recibido: {new Intl.NumberFormat("es-CO", {
                              style: "currency",
                              currency: "COP",
                              maximumFractionDigits: 0
                            }).format(Number(item.precio))}
                          </div>
                        ) : (
                          <div className="mb-3">
                            <label className="form-label fw-bold" htmlFor={`precio-${item.id}`}>
                              Precio del servicio (COP)
                            </label>
                            <div className="input-group">
                              <span className="input-group-text">$</span>
                              <input
                                id={`precio-${item.id}`}
                                type="number"
                                min="1"
                                step="1"
                                className="form-control"
                                disabled={Number(item.precio) > 0}
                                value={precios[item.id] || ""}
                                onChange={(event) => setPrecios((prev) => ({
                                  ...prev,
                                  [item.id]: event.target.value
                                }))}
                                placeholder="Ej. 150000"
                              />
                              <button
                                className="btn btn-outline-primary"
                                type="button"
                                onClick={() => guardarPrecio(item)}
                                disabled={guardandoPrecioId === item.id}
                              >
                                {guardandoPrecioId === item.id ? "Guardando..." : "Guardar precio"}
                              </button>
                            </div>
                            <small className="text-muted">
                              {Number(item.precio) > 0
                                ? "Cotización enviada; el precio queda bloqueado para evitar cambios durante el pago."
                                : "Al guardar, el cliente verá este precio en Mi Historial."}
                            </small>
                          </div>
                        )
                      )}
                      
                      {item.estado === "En proceso" && (
                        <button 
                          className="btn btn-primary w-100 fw-bold mt-2"
                          onClick={() => cambiarEstadoTrabajo(item.id, "Finalizado")}
                        >
                          <i className="bi bi-check2-all me-1"></i> Marcar como Finalizado
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      )}
    </div>
  );
};

export default TecnicoDashboard;