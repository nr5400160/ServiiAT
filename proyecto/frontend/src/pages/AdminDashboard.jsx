import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const ESTADOS = ["Pendiente", "En proceso", "Finalizado", "Cancelado"];

const claseEstado = (estado) => ({
  Pendiente: "pendiente",
  "En proceso": "proceso",
  Finalizado: "finalizado",
  Cancelado: "cancelado"
}[estado] || "otro");

const inicialesCliente = (solicitud) => (
  `${solicitud.nombre_1?.[0] || ""}${solicitud.apellido_1?.[0] || ""}`.toUpperCase() || "CL"
);

const AdminDashboard = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorServidor, setErrorServidor] = useState("");
  const [errorAccion, setErrorAccion] = useState("");
  const [mensajeAccion, setMensajeAccion] = useState("");
  const [actualizandoId, setActualizandoId] = useState(null);
  const [tecnicosSeleccionados, setTecnicosSeleccionados] = useState({});
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    obtenerDatosAdmin();
  }, []);

  async function obtenerDatosAdmin() {
    setCargando(true);
    setErrorServidor("");
    try {
      const headers = { Authorization: `Bearer ${sessionStorage.getItem("token")}` };
      const [resSolicitudes, resTecnicos] = await Promise.all([
        fetch(`${API_URL}/api/admin/solicitudes`, { headers }),
        fetch(`${API_URL}/api/admin/tecnicos`, { headers })
      ]);
      const [dataSolicitudes, dataTecnicos] = await Promise.all([
        resSolicitudes.json(),
        resTecnicos.json()
      ]);

      if (!resSolicitudes.ok || !Array.isArray(dataSolicitudes)) {
        setSolicitudes([]);
        setErrorServidor(dataSolicitudes?.detalle || dataSolicitudes?.error || "Error al cargar las solicitudes.");
        return;
      }
      if (!resTecnicos.ok || !Array.isArray(dataTecnicos)) {
        setErrorServidor(dataTecnicos?.error || "No se pudo cargar la lista de técnicos.");
        return;
      }
      setSolicitudes(dataSolicitudes);
      setTecnicos(dataTecnicos);
    } catch (error) {
      setErrorServidor(error.message || "No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  }

  async function resolverSolicitud(solicitud, decision) {
    const idSolicitud = solicitud.id_solicitud;
    const idTecnico = Number(tecnicosSeleccionados[idSolicitud]);
    if (decision === "aprobar" && !idTecnico) {
      setErrorAccion("Selecciona un técnico antes de aprobar la solicitud.");
      return;
    }
    if (decision === "rechazar"
      && !window.confirm(`¿Seguro que deseas rechazar la solicitud #${idSolicitud}?`)) {
      return;
    }

    setActualizandoId(idSolicitud);
    setErrorAccion("");
    setMensajeAccion("");

    try {
      const res = await fetch(
        `${API_URL}/api/admin/solicitudes/${idSolicitud}/decision`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
          },
          body: JSON.stringify(decision === "aprobar"
            ? { decision, id_tecnico: idTecnico }
            : { decision })
        }
      );
      const resultado = await res.json();
      if (!res.ok) throw new Error(resultado.error || "No se pudo resolver la solicitud.");

      setSolicitudes((prev) => prev.map((item) => (
        item.id_solicitud === idSolicitud
          ? {
            ...item,
            nombre_estado: decision === "rechazar" ? "Cancelado" : item.nombre_estado,
            id_tecnico_asignado: decision === "aprobar" ? idTecnico : null,
            nombre_tecnico: decision === "aprobar"
              ? tecnicos.find((tecnico) => Number(tecnico.id_usuario) === idTecnico)?.nombre || ""
              : ""
          }
          : item
      )));
      setMensajeAccion(resultado.mensaje || `Solicitud #${idSolicitud} actualizada.`);

      if (solicitud.email) {
        const resNotificacion = await fetch(`${API_URL}/api/notificaciones/enviar`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombreCliente: `${solicitud.nombre_1 || ""} ${solicitud.apellido_1 || ""}`.trim(),
            email: solicitud.email,
            estado: decision === "aprobar" ? "Aprobada y asignada" : "Cancelado",
            fecha_solicitud: solicitud.fecha_solicitud,
            hora: solicitud.hora_servicio || "09:00",
            descripcion: solicitud.descripcion,
            nombre_equipo: solicitud.nombre_equipo
          })
        });
        if (!resNotificacion.ok) {
          throw new Error("La solicitud se actualizó, pero no se pudo enviar el correo al cliente.");
        }
      }
    } catch (error) {
      setErrorAccion(error.message || "No se pudo actualizar la solicitud.");
    } finally {
      setActualizandoId(null);
    }
  }

  const contarEstado = (estado) => (
    estado === "Todos"
      ? solicitudes.length
      : estado === "Pendiente"
        ? solicitudes.filter((solicitud) => (
          solicitud.nombre_estado === "Pendiente" && !solicitud.id_tecnico_asignado
        )).length
        : estado === "Asignada"
          ? solicitudes.filter((solicitud) => (
            solicitud.nombre_estado === "Pendiente" && solicitud.id_tecnico_asignado
          )).length
          : solicitudes.filter((solicitud) => solicitud.nombre_estado === estado).length
  );

  const buscarTexto = busqueda.trim().toLocaleLowerCase("es");
  const solicitudesFiltradas = solicitudes.filter((solicitud) => {
    const coincideEstado = filtroEstado === "Todos"
      ? true
      : filtroEstado === "Pendiente"
        ? solicitud.nombre_estado === "Pendiente" && !solicitud.id_tecnico_asignado
        : filtroEstado === "Asignada"
          ? solicitud.nombre_estado === "Pendiente" && Boolean(solicitud.id_tecnico_asignado)
          : solicitud.nombre_estado === filtroEstado;
    const textoSolicitud = [
      solicitud.nombre_1,
      solicitud.apellido_1,
      solicitud.email,
      solicitud.nombre_tecnico,
      solicitud.nombre_equipo,
      solicitud.marca_equipo,
      solicitud.descripcion,
      solicitud.direccion_servicio
    ].filter(Boolean).join(" ").toLocaleLowerCase("es");
    return coincideEstado && (!buscarTexto || textoSolicitud.includes(buscarTexto));
  });

  const resumen = [
    { etiqueta: "Solicitudes", estado: "Todos", icono: "bi-collection", clase: "total" },
    { etiqueta: "Por revisar", estado: "Pendiente", icono: "bi-hourglass-split", clase: "pendiente" },
    { etiqueta: "Aprobadas y asignadas", estado: "Asignada", icono: "bi-person-check", clase: "proceso" },
    { etiqueta: "En proceso", estado: "En proceso", icono: "bi-gear-wide-connected", clase: "finalizado" }
  ];

  return (
    <section className="admin-dashboard">
      <header className="admin-dashboard__encabezado">
        <div>
          <span className="admin-dashboard__eyebrow">PANEL DE CONTROL</span>
          <h1>Gestión de solicitudes</h1>
          <p>Supervisa los servicios y mantén su información actualizada.</p>
        </div>
        <button
          type="button"
          className="admin-dashboard__actualizar"
          onClick={obtenerDatosAdmin}
          disabled={cargando}
        >
          <i className={`bi ${cargando ? "bi-arrow-repeat" : "bi-arrow-clockwise"}`} aria-hidden="true"></i>
          <span>{cargando ? "Actualizando..." : "Actualizar"}</span>
        </button>
      </header>

      {errorServidor && (
        <div className="admin-dashboard__alerta admin-dashboard__alerta--error" role="alert">
          <i className="bi bi-exclamation-circle-fill" aria-hidden="true"></i>
          <span>{errorServidor}</span>
          <button type="button" onClick={obtenerDatosAdmin}>Reintentar</button>
        </div>
      )}
      {errorAccion && (
        <div className="admin-dashboard__alerta admin-dashboard__alerta--error" role="alert">
          <i className="bi bi-exclamation-circle-fill" aria-hidden="true"></i>
          <span>{errorAccion}</span>
          <button type="button" onClick={() => setErrorAccion("")} aria-label="Cerrar mensaje">×</button>
        </div>
      )}
      {mensajeAccion && (
        <div className="admin-dashboard__alerta admin-dashboard__alerta--exito" role="status">
          <i className="bi bi-check-circle-fill" aria-hidden="true"></i>
          <span>{mensajeAccion}</span>
          <button type="button" onClick={() => setMensajeAccion("")} aria-label="Cerrar mensaje">×</button>
        </div>
      )}

      <div className="admin-dashboard__resumen">
        {resumen.map((dato) => (
          <button
            type="button"
            key={dato.estado}
            className={`admin-resumen admin-resumen--${dato.clase} ${filtroEstado === dato.estado ? "admin-resumen--activo" : ""}`}
            onClick={() => setFiltroEstado(dato.estado)}
          >
            <span className="admin-resumen__icono">
              <i className={`bi ${dato.icono}`} aria-hidden="true"></i>
            </span>
            <span className="admin-resumen__texto">
              <span>{dato.etiqueta}</span>
              <strong>{contarEstado(dato.estado)}</strong>
            </span>
            <i className="bi bi-arrow-up-right admin-resumen__flecha" aria-hidden="true"></i>
          </button>
        ))}
      </div>

      <div className="admin-dashboard__herramientas">
        <div className="admin-dashboard__busqueda">
          <i className="bi bi-search" aria-hidden="true"></i>
          <input
            type="search"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            placeholder="Buscar cliente, equipo, dirección..."
            aria-label="Buscar solicitudes"
          />
          {busqueda && (
            <button type="button" onClick={() => setBusqueda("")} aria-label="Limpiar búsqueda">
              <i className="bi bi-x-lg" aria-hidden="true"></i>
            </button>
          )}
        </div>
        <span className="admin-dashboard__cantidad">
          Mostrando <strong>{solicitudesFiltradas.length}</strong> de {solicitudes.length}
        </span>
      </div>

      <nav className="admin-dashboard__filtros" aria-label="Filtrar por estado">
        {["Todos", "Pendiente", "Asignada", ...ESTADOS.filter((estado) => estado !== "Pendiente")].map((estado) => (
          <button
            type="button"
            key={estado}
            className={`admin-filtro ${filtroEstado === estado ? "admin-filtro--activo" : ""}`}
            onClick={() => setFiltroEstado(estado)}
            aria-pressed={filtroEstado === estado}
          >
            {estado}
            <span>{contarEstado(estado)}</span>
          </button>
        ))}
      </nav>

      {cargando ? (
        <div className="admin-dashboard__cargando" role="status">
          <span className="spinner-border text-primary" aria-hidden="true"></span>
          <p>Cargando solicitudes...</p>
        </div>
      ) : solicitudesFiltradas.length === 0 ? (
        <div className="admin-dashboard__vacio">
          <span><i className="bi bi-inbox" aria-hidden="true"></i></span>
          <h2>{solicitudes.length ? "No encontramos coincidencias" : "Aún no hay solicitudes"}</h2>
          <p>
            {solicitudes.length
              ? "Prueba con otro término o cambia el filtro de estado."
              : "Cuando se registre un servicio, aparecerá aquí."}
          </p>
          {(busqueda || filtroEstado !== "Todos") && (
            <button
              type="button"
              onClick={() => {
                setBusqueda("");
                setFiltroEstado("Todos");
              }}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="admin-dashboard__lista">
          {solicitudesFiltradas.map((solicitud) => (
            <article
              key={solicitud.id_solicitud}
              className={`admin-solicitud admin-solicitud--${claseEstado(solicitud.nombre_estado)} ${solicitud.id_tecnico_asignado && solicitud.nombre_estado === "Pendiente" ? "admin-solicitud--asignada" : ""}`}
            >
              <header className="admin-solicitud__encabezado">
                <span className="admin-solicitud__numero">
                  <i className="bi bi-hash" aria-hidden="true"></i>
                  Solicitud {solicitud.id_solicitud}
                </span>
                <span className={`admin-solicitud__estado admin-solicitud__estado--${solicitud.id_tecnico_asignado && solicitud.nombre_estado === "Pendiente" ? "asignada" : claseEstado(solicitud.nombre_estado)}`}>
                  <i className="bi bi-circle-fill" aria-hidden="true"></i>
                  {solicitud.id_tecnico_asignado && solicitud.nombre_estado === "Pendiente"
                    ? "Aprobada y asignada"
                    : solicitud.nombre_estado || "Pendiente"}
                </span>
              </header>

              <div className="admin-solicitud__cliente">
                <span className="admin-solicitud__avatar">{inicialesCliente(solicitud)}</span>
                <div>
                  <h2>{`${solicitud.nombre_1 || ""} ${solicitud.apellido_1 || ""}`.trim() || "Cliente"}</h2>
                  <span>{solicitud.email || "Sin correo registrado"}</span>
                </div>
              </div>

              <div className="admin-solicitud__equipo">
                <span className="admin-solicitud__equipo-icono">
                  <i className="bi bi-tools" aria-hidden="true"></i>
                </span>
                <div>
                  <span>Equipo del servicio</span>
                  <strong>
                    {solicitud.nombre_equipo || "Equipo no especificado"}
                    {solicitud.marca_equipo && solicitud.marca_equipo !== "No especificada"
                      ? ` · ${solicitud.marca_equipo}`
                      : ""}
                  </strong>
                </div>
              </div>

              <div className="admin-solicitud__descripcion">
                <span><i className="bi bi-chat-left-text" aria-hidden="true"></i> Descripción</span>
                <p>{solicitud.descripcion || "Sin descripción"}</p>
              </div>

              <div className="admin-solicitud__detalles">
                <div>
                  <i className="bi bi-calendar3" aria-hidden="true"></i>
                  <span>Fecha del servicio<strong>{solicitud.fecha_solicitud || "Sin fecha"}</strong></span>
                </div>
                <div>
                  <i className="bi bi-geo-alt" aria-hidden="true"></i>
                  <span>Dirección<strong>{solicitud.direccion_servicio || "Sin dirección"}</strong></span>
                </div>
              </div>

              {solicitud.nombre_estado === "Pendiente" && !solicitud.id_tecnico_asignado ? (
                <div className="admin-solicitud__acciones">
                  <label className="admin-solicitud__asignar">
                    <span><i className="bi bi-person-plus" aria-hidden="true"></i> Asignar técnico</span>
                    <select
                      value={tecnicosSeleccionados[solicitud.id_solicitud] || ""}
                      onChange={(event) => setTecnicosSeleccionados((prev) => ({
                        ...prev,
                        [solicitud.id_solicitud]: event.target.value
                      }))}
                      disabled={actualizandoId === solicitud.id_solicitud || tecnicos.length === 0}
                    >
                      <option value="">Selecciona un técnico</option>
                      {tecnicos.map((tecnico) => (
                        <option key={tecnico.id_usuario} value={tecnico.id_usuario}>{tecnico.nombre}</option>
                      ))}
                    </select>
                  </label>
                  <div className="admin-solicitud__decision">
                    <button
                      type="button"
                      className="admin-solicitud__aprobar"
                      onClick={() => resolverSolicitud(solicitud, "aprobar")}
                      disabled={actualizandoId === solicitud.id_solicitud || tecnicos.length === 0}
                    >
                      <i className="bi bi-check-lg" aria-hidden="true"></i>
                      Aprobar y asignar
                    </button>
                    <button
                      type="button"
                      className="admin-solicitud__rechazar"
                      onClick={() => resolverSolicitud(solicitud, "rechazar")}
                      disabled={actualizandoId === solicitud.id_solicitud}
                    >
                      <i className="bi bi-x-lg" aria-hidden="true"></i>
                      Rechazar
                    </button>
                  </div>
                  {actualizandoId === solicitud.id_solicitud && (
                    <span className="admin-solicitud__procesando">
                      <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                      Procesando solicitud...
                    </span>
                  )}
                  {tecnicos.length === 0 && (
                    <span className="admin-solicitud__sin-tecnicos">
                      Registra primero un técnico para poder asignar esta solicitud.
                    </span>
                  )}
                </div>
              ) : solicitud.id_tecnico_asignado ? (
                <div className="admin-solicitud__tecnico">
                  <span><i className="bi bi-person-check-fill" aria-hidden="true"></i></span>
                  <div>
                    <small>Responsable asignado</small>
                    <strong>{solicitud.nombre_tecnico || "Técnico asignado"}</strong>
                  </div>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default AdminDashboard;
