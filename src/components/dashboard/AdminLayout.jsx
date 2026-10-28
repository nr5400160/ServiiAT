import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import MenuLateral from "./MenuLateral"; // Verifica que esta ruta apunte bien a tu MenuLateral

const AdminLayout = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorServidor, setErrorServidor] = useState("");
  const [actualizandoId, setActualizandoId] = useState(null);
  const [horasProgramadas, setHorasProgramadas] = useState({});

  // Coinciden exactamente con el switch(estado) de tu /api/notificaciones/enviar
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

      console.log("DATOS ADMIN:", data);

      if (!res.ok || !Array.isArray(data)) {
        setSolicitudes([]);
        setErrorServidor(data?.detalle || data?.error || "Error al cargar las solicitudes.");
        return;
      }

      setSolicitudes(data);
    } catch (error) {
      console.error("ERROR ADMIN:", error);
      setErrorServidor("No se pudo conectar con el servidor (puerto 3001).");
      setSolicitudes([]);
    } finally {
      setCargando(false);
    }
  }

  const handleHoraChange = (idSolicitud, valorHora) => {
    setHorasProgramadas((prev) => ({
      ...prev,
      [idSolicitud]: valorHora
    }));
  };

  async function manejarCambioEstado(solicitud, nuevoNombreEstado) {
    const estadoSeleccionado = ESTADOS.find((e) => e.nombre === nuevoNombreEstado);
    if (!estadoSeleccionado) return;

    setActualizandoId(solicitud.id_solicitud);

    const nombreCompleto = `${solicitud.nombre_1 || ""} ${solicitud.apellido_1 || ""}`.trim();
    const horaElegida = horasProgramadas[solicitud.id_solicitud] || "09:00";

    try {
      // 1. Actualizar estado en Supabase a través del backend
      const resUpdate = await fetch(
        `http://localhost:3001/api/admin/solicitudes/${solicitud.id_solicitud}/estado`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_estado: estadoSeleccionado.id,
            nombre_estado: estadoSeleccionado.nombre
          })
        }
      );

      const dataUpdate = await resUpdate.json();

      if (!resUpdate.ok) {
        throw new Error(dataUpdate.error || "Error al actualizar el estado en la BD.");
      }

      // 2. Enviar correo al cliente usando tu endpoint /api/notificaciones/enviar
      if (solicitud.email) {
        const resNotif = await fetch("http://localhost:3001/api/notificaciones/enviar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombreCliente: nombreCompleto,
            email: solicitud.email,
            estado: estadoSeleccionado.nombre,
            fecha_solicitud: solicitud.fecha_solicitud,
            hora: horaElegida,
            descripcion: solicitud.descripcion,
            nombre_equipo: solicitud.nombre_equipo
          })
        });

        if (!resNotif.ok) {
          throw new Error("Se actualizó el estado en la BD, pero hubo un problema enviando el correo.");
        }
      } else {
        console.warn("El usuario no tiene correo registrado en correo_electronico.");
      }

      // 3. Actualizar el estado en la vista inmediatamente
      setSolicitudes((prev) =>
        prev.map((item) =>
          item.id_solicitud === solicitud.id_solicitud
            ? { ...item, nombre_estado: estadoSeleccionado.nombre }
            : item
        )
      );

      alert(
        solicitud.email
          ? `✅ Estado cambiado a "${estadoSeleccionado.nombre}" y notificación enviada a ${solicitud.email}`
          : `✅ Estado cambiado a "${estadoSeleccionado.nombre}" (usuario sin correo asociado)`
      );
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert("❌ " + error.message);
    } finally {
      setActualizandoId(null);
    }
  }

  return (
    <div className="app" style={{ display: "flex", minHeight: "100vh" }}>
      <MenuLateral />

      <div className="contenido" style={{ flex: 1, padding: "20px" }}>
        <div className="p-3">
          <h3>Panel Administrador</h3>

          {errorServidor && (
            <div
              style={{
                backgroundColor: "#fee2e2",
                color: "#b91c1c",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "15px"
              }}
            >
              <strong>Error:</strong> {errorServidor}
            </div>
          )}

          {cargando ? (
            <p>Cargando solicitudes...</p>
          ) : (
            <>
              <p>Solicitudes encontradas: {solicitudes.length}</p>

              {solicitudes.map((solicitud) => (
                <div
                  key={solicitud.id_solicitud}
                  style={{
                    border: "1px solid gray",
                    marginBottom: "12px",
                    padding: "15px",
                    borderRadius: "10px",
                    backgroundColor: "#fff"
                  }}
                >
                  <p>
                    <strong>Cliente:</strong> {solicitud.nombre_1} {solicitud.apellido_1}{" "}
                    {solicitud.email && <span style={{ color: "#666" }}>({solicitud.email})</span>}
                  </p>

                  <p>
                    <strong>Equipo:</strong> {solicitud.nombre_equipo}
                  </p>

                  <p>
                    <strong>Marca:</strong> {solicitud.marca_equipo}
                  </p>

                  <p>
                    <strong>Estado:</strong>{" "}
                    <span style={{ fontWeight: "bold", color: "#1abc9c" }}>
                      {solicitud.nombre_estado}
                    </span>
                  </p>

                  <p>
                    <strong>Descripción:</strong> {solicitud.descripcion}
                  </p>

                  <p>
                    <strong>Dirección:</strong> {solicitud.direccion_servicio}
                  </p>

                  <p>
                    <strong>Fecha:</strong> {solicitud.fecha_solicitud}
                  </p>

                  {/* HORA PROGRAMADA Y SELECTOR DE ESTADO */}
                  <div
                    style={{
                      marginTop: "12px",
                      paddingTop: "10px",
                      borderTop: "1px solid #ddd",
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: "15px"
                    }}
                  >
                    <div>
                      <label style={{ marginRight: "6px", fontSize: "14px" }}>
                        <strong>Hora programada:</strong>
                      </label>
                      <input
                        type="time"
                        value={horasProgramadas[solicitud.id_solicitud] || "09:00"}
                        onChange={(e) =>
                          handleHoraChange(solicitud.id_solicitud, e.target.value)
                        }
                        style={{
                          padding: "4px 8px",
                          borderRadius: "5px",
                          border: "1px solid #ccc"
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ marginRight: "6px", fontSize: "14px" }}>
                        <strong>Cambiar estado:</strong>
                      </label>
                      <select
                        value={solicitud.nombre_estado || "Pendiente"}
                        disabled={actualizandoId === solicitud.id_solicitud}
                        onChange={(e) => manejarCambioEstado(solicitud, e.target.value)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: "5px",
                          border: "1px solid #888",
                          cursor: "pointer"
                        }}
                      >
                        {ESTADOS.map((est) => (
                          <option key={est.id} value={est.nombre}>
                            {est.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    {actualizandoId === solicitud.id_solicitud && (
                      <span style={{ color: "#1abc9c", fontWeight: "bold", fontSize: "13px" }}>
                        Actualizando y enviando correo...
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;