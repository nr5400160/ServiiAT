import React, { useState, useEffect } from "react";

const SolicitudesAdmin = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorServidor, setErrorServidor] = useState("");
  const [actualizandoId, setActualizandoId] = useState(null);
  const [horasProgramadas, setHorasProgramadas] = useState({});

  const ESTADOS = [
    { id: 1, nombre: "Pendiente" },
    { id: 2, nombre: "En proceso" },
    { id: 3, nombre: "Finalizado" },
    { id: 4, nombre: "Cancelado" }
  ];

  useEffect(() => {
    obtenerDatosAdmin();
  }, []);

  async function obtenerDatosAdmin() {
    setCargando(true);
    setErrorServidor("");
    try {
      const res = await fetch("http://localhost:3001/api/admin/solicitudes");
      const data = await res.json();
      if (!res.ok || !Array.isArray(data)) {
        setSolicitudes([]);
        setErrorServidor(data?.detalle || data?.error || "Error al cargar las solicitudes.");
        return;
      }
      setSolicitudes(data);
    } catch (error) {
      setErrorServidor("No se pudo conectar con el servidor (puerto 3001).");
      setSolicitudes([]);
    } finally {
      setCargando(false);
    }
  }

  const handleHoraChange = (idSolicitud, valorHora) => {
    setHorasProgramadas((prev) => ({ ...prev, [idSolicitud]: valorHora }));
  };

  async function manejarCambioEstado(solicitud, nuevoNombreEstado) {
    const estadoSeleccionado = ESTADOS.find((e) => e.nombre === nuevoNombreEstado);
    if (!estadoSeleccionado) return;

    setActualizandoId(solicitud.id_solicitud);
    const nombreCompleto = `${solicitud.nombre_1 || ""} ${solicitud.apellido_1 || ""}`.trim();
    const horaElegida = horasProgramadas[solicitud.id_solicitud] || "09:00";

    try {
      const resUpdate = await fetch(`http://localhost:3001/api/admin/solicitudes/${solicitud.id_solicitud}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_estado: estadoSeleccionado.id, nombre_estado: estadoSeleccionado.nombre })
      });
      const dataUpdate = await resUpdate.json();
      if (!resUpdate.ok) throw new Error(dataUpdate.error || "Error BD.");

      if (solicitud.email) {
        const resNotif = await fetch("http://localhost:3001/api/notificaciones/enviar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombreCliente: nombreCompleto, email: solicitud.email,
            estado: estadoSeleccionado.nombre, fecha_solicitud: solicitud.fecha_solicitud,
            hora: horaElegida, descripcion: solicitud.descripcion, nombre_equipo: solicitud.nombre_equipo
          })
        });
        if (!resNotif.ok) throw new Error("Error correo.");
      }

      setSolicitudes((prev) => prev.map((item) =>
        item.id_solicitud === solicitud.id_solicitud ? { ...item, nombre_estado: estadoSeleccionado.nombre } : item
      ));

      alert(`✅ Estado actualizado a "${estadoSeleccionado.nombre}"`);
    } catch (error) {
      alert("❌ " + error.message);
    } finally {
      setActualizandoId(null);
    }
  }

  return (
    <div>
      <h2 style={{ color: '#0d47a1', borderBottom: '2px solid #0d47a1', paddingBottom: '10px', marginBottom: '20px' }}>
        Gestión de Solicitudes
      </h2>

      {errorServidor && (
        <div style={{ backgroundColor: "#fee2e2", color: "#b91c1c", padding: "12px", borderRadius: "8px", marginBottom: "15px" }}>
          <strong>Error:</strong> {errorServidor}
        </div>
      )}

      {cargando ? (
        <p>Cargando solicitudes...</p>
      ) : (
        <>
          <p style={{ marginBottom: "20px", color: "#555" }}>Solicitudes totales encontradas: {solicitudes.length}</p>
          {solicitudes.map((solicitud) => (
            <div key={solicitud.id_solicitud} style={{ border: "1px solid #ddd", marginBottom: "15px", padding: "20px", borderRadius: "10px", backgroundColor: "#fff", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
              <p><strong>Cliente:</strong> {solicitud.nombre_1} {solicitud.apellido_1} {solicitud.email && <span style={{ color: "#666" }}>({solicitud.email})</span>}</p>
              <p><strong>Equipo:</strong> {solicitud.nombre_equipo} | <strong>Marca:</strong> {solicitud.marca_equipo}</p>
              <p><strong>Estado:</strong> <span style={{ fontWeight: "bold", color: "#1abc9c" }}>{solicitud.nombre_estado}</span></p>
              <p><strong>Descripción:</strong> {solicitud.descripcion}</p>
              <p><strong>Dirección:</strong> {solicitud.direccion_servicio} | <strong>Fecha:</strong> {solicitud.fecha_solicitud}</p>

              <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #eee", display: "flex", gap: "20px", alignItems: "center" }}>
                <div>
                  <label style={{ marginRight: "10px", fontSize: "14px", fontWeight: "bold" }}>Hora programada:</label>
                  <input type="time" value={horasProgramadas[solicitud.id_solicitud] || "09:00"} onChange={(e) => handleHoraChange(solicitud.id_solicitud, e.target.value)} style={{ padding: "6px", borderRadius: "5px", border: "1px solid #ccc" }} />
                </div>
                <div>
                  <label style={{ marginRight: "10px", fontSize: "14px", fontWeight: "bold" }}>Cambiar estado:</label>
                  <select value={solicitud.nombre_estado || "Pendiente"} disabled={actualizandoId === solicitud.id_solicitud} onChange={(e) => manejarCambioEstado(solicitud, e.target.value)} style={{ padding: "6px 12px", borderRadius: "5px", border: "1px solid #888", cursor: "pointer" }}>
                    {ESTADOS.map((est) => (
                      <option key={est.id} value={est.nombre}>{est.nombre}</option>
                    ))}
                  </select>
                </div>
                {actualizandoId === solicitud.id_solicitud && <span style={{ color: "#1abc9c", fontWeight: "bold" }}>Procesando...</span>}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default SolicitudesAdmin;