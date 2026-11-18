import React, { useState, useEffect } from "react";
import "../index.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const ClienteDashboard = () => {
  const [misSolicitudes, setMisSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorLocal, setErrorLocal] = useState("");
  const [pagandoId, setPagandoId] = useState(null);
  const [modoPago, setModoPago] = useState("deshabilitado");
  const [metodoDemo, setMetodoDemo] = useState("Tarjeta");
  const [ticketGenerado, setTicketGenerado] = useState(null);

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
      const headers = { Authorization: `Bearer ${sessionStorage.getItem("token")}` };
      const [historialRes, modoRes] = await Promise.all([
        fetch(`${API_URL}/api/cliente/solicitudes/${idUsuario}`, { headers }),
        fetch(`${API_URL}/api/pagos/modo`, { headers })
      ]);

      if (!historialRes.ok) {
        const error = await historialRes.json();
        throw new Error(error.error || error.detalle || `Error al cargar el historial (${historialRes.status}).`);
      }
      if (!modoRes.ok) {
        const error = await modoRes.json();
        throw new Error(error.error || error.detalle || `Error al consultar el modo de pago (${modoRes.status}).`);
      }

      const [data, configuracionPago] = await Promise.all([
        historialRes.json(),
        modoRes.json()
      ]);
      if (!["demo", "deshabilitado"].includes(configuracionPago.modo)) {
        throw new Error("El servidor devolvió un modo de pago no válido.");
      }

      setMisSolicitudes(data.map((item) => ({ ...item, pagoSimulado: false })));
      setModoPago(configuracionPago.modo);
    } catch (error) {
      console.error("Error:", error);
      setErrorLocal(error.message || "Ocurrió un problema al conectar con el historial.");
    } finally {
      setCargando(false);
    }
  }

  async function iniciarPago(item) {
    setPagandoId(item.id_solicitud);
    setErrorLocal("");
    setTicketGenerado(null);
    try {
      const res = await fetch(`${API_URL}/api/pagos/solicitudes/${item.id_solicitud}/demo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`
        },
        body: JSON.stringify({ metodo_pago: metodoDemo })
      });
      const resultado = await res.json();
      if (!res.ok) throw new Error(resultado.error || "No se pudo simular el pago.");
      if (!resultado.id_ticket || resultado.simulado !== true) {
        throw new Error("El pago se registró, pero no se recibió el ticket.");
      }
      setMisSolicitudes((solicitudes) => solicitudes.map((solicitud) => (
        solicitud.id_solicitud === item.id_solicitud
          ? { ...solicitud, pagado: true, pagoSimulado: true }
          : solicitud
      )));
      setTicketGenerado({
        ...resultado,
        nombre_equipo: item.nombre_equipo,
        marca_equipo: item.marca_equipo,
        direccion_servicio: item.direccion_servicio,
        fecha_pago: new Date().toLocaleString("es-CO")
      });
    } catch (error) {
      setErrorLocal(error.message || "No se pudo iniciar el pago.");
    } finally {
      setPagandoId(null);
    }
  }

  const formatoCOP = (valor) => new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(Number(valor));

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
      {modoPago === "demo" && (
        <div className="alert alert-warning text-center shadow-sm" role="status">
          <strong>MODO DEMOSTRACIÓN:</strong> este pago es simulado; no se realizará ningún cobro real.
        </div>
      )}
      {ticketGenerado && (
        <section className="ticket-recibo mx-auto my-4" role="status" aria-label="Ticket de pago generado">
          <header className="ticket-encabezado">
            <div className="ticket-marca">
              <i className="bi bi-tools" aria-hidden="true"></i>
              <span>ServiiAT</span>
            </div>
            <span className="ticket-estado">PAGO EXITOSO</span>
            <h3>¡Gracias por tu pago!</h3>
            <p>Comprobante de tu servicio técnico</p>
          </header>
          <div className="ticket-total">
            <span>Total pagado</span>
            <strong>{formatoCOP(ticketGenerado.monto)}</strong>
            <small>Pago simulado · no se realizó un cobro real</small>
          </div>
          <div className="ticket-detalles">
            <div>
              <span>Número de ticket</span>
              <strong>#{ticketGenerado.id_ticket}</strong>
            </div>
            <div>
              <span>Fecha de pago</span>
              <strong>{ticketGenerado.fecha_pago}</strong>
            </div>
            <div>
              <span>Servicio</span>
              <strong>
                {ticketGenerado.nombre_equipo}
                {ticketGenerado.marca_equipo && ticketGenerado.marca_equipo !== "No especificada"
                  ? ` (${ticketGenerado.marca_equipo})`
                  : ""}
              </strong>
            </div>
            <div>
              <span>Método de pago</span>
              <strong>{ticketGenerado.metodo_pago}</strong>
            </div>
            <div className="ticket-direccion">
              <span>Dirección del servicio</span>
              <strong>{ticketGenerado.direccion_servicio}</strong>
            </div>
          </div>
          <footer className="ticket-acciones">
            <button type="button" className="btn btn-primary fw-bold" onClick={() => window.print()}>
              <i className="bi bi-printer me-2" aria-hidden="true"></i>
              Imprimir ticket
            </button>
          </footer>
        </section>
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
          {misSolicitudes.map((item) => {
            const estadoVisual = {
              Pendiente: ["pendiente", "bi-hourglass-split"],
              "En proceso": ["proceso", "bi-gear-fill"],
              Finalizado: ["finalizado", "bi-check-circle-fill"]
            }[item.nombre_estado] || ["otro", "bi-info-circle-fill"];
            const [estadoClase, iconoEstado] = estadoVisual;

            return (
              <div key={item.id_solicitud} className="col-12 col-md-6 col-lg-4">
                <article className="solicitud-card">
                  <div className="solicitud-card__cabecera">
                    <span className={`solicitud-card__estado solicitud-card__estado--${estadoClase}`}>
                      <i className={`bi ${iconoEstado}`} aria-hidden="true"></i>
                      {item.nombre_estado}
                    </span>
                    <span className="solicitud-card__numero">Solicitud #{item.id_solicitud}</span>
                  </div>

                  <div className="solicitud-card__contenido">
                    <div className="solicitud-card__equipo">
                      <span className="solicitud-card__equipo-icono">
                        <i className="bi bi-tools" aria-hidden="true"></i>
                      </span>
                      <div className="solicitud-card__equipo-info">
                        <span>Servicio técnico</span>
                        <h3>
                          {item.nombre_equipo}
                          {item.marca_equipo && item.marca_equipo !== "No especificada"
                            ? ` (${item.marca_equipo})`
                            : ""}
                        </h3>
                      </div>
                    </div>

                    <div className="solicitud-card__fecha">
                      <i className="bi bi-calendar3" aria-hidden="true"></i>
                      <span>Solicitado el <strong>{item.fecha_solicitud}</strong></span>
                    </div>

                    <section className="solicitud-card__problema">
                      <div className="solicitud-card__etiqueta">
                        <i className="bi bi-chat-left-text" aria-hidden="true"></i>
                        <span>Descripción del problema</span>
                      </div>
                      <p>{item.descripcion}</p>
                    </section>

                    {Number(item.precio_servicio) > 0 ? (
                      <section className="solicitud-card__pago">
                        <div className="solicitud-card__precio">
                          <div>
                            <span>Valor del servicio</span>
                            <strong>{formatoCOP(item.precio_servicio)}</strong>
                          </div>
                          <span className="solicitud-card__precio-icono">
                            <i className="bi bi-receipt" aria-hidden="true"></i>
                          </span>
                        </div>
                        {item.pagado ? (
                          <span className="solicitud-card__pagado">
                            <i className="bi bi-check-circle-fill" aria-hidden="true"></i>
                            {item.pagoSimulado ? "Pago simulado (no real)" : "Pago confirmado"}
                          </span>
                        ) : modoPago === "demo" ? (
                          <div className="solicitud-card__formulario-pago">
                            <label htmlFor={`metodo-demo-${item.id_solicitud}`}>
                              Método de pago
                            </label>
                            <select
                              id={`metodo-demo-${item.id_solicitud}`}
                              className="form-select solicitud-card__select"
                              value={metodoDemo}
                              onChange={(event) => setMetodoDemo(event.target.value)}
                            >
                              <option value="Tarjeta">Tarjeta</option>
                              <option value="Transferencia">Transferencia</option>
                              <option value="Efectivo">Efectivo</option>
                            </select>
                            <button
                              className="btn-pagar-servicio w-100"
                              onClick={() => iniciarPago(item)}
                              disabled={pagandoId === item.id_solicitud}
                              aria-busy={pagandoId === item.id_solicitud}
                            >
                              <span className="btn-pagar-icono">
                                <i className="bi bi-credit-card-2-front-fill" aria-hidden="true"></i>
                              </span>
                              <span className="btn-pagar-texto">
                                {pagandoId === item.id_solicitud ? "Procesando pago..." : "Pagar servicio"}
                              </span>
                              {pagandoId === item.id_solicitud ? (
                                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                              ) : (
                                <i className="bi bi-arrow-right btn-pagar-flecha" aria-hidden="true"></i>
                              )}
                            </button>
                          </div>
                        ) : (
                          <div className="alert alert-secondary mb-0" role="status">
                            Los pagos no están habilitados actualmente.
                          </div>
                        )}
                      </section>
                    ) : (
                      <div className="solicitud-card__precio-pendiente">
                        <i className="bi bi-hourglass-split" aria-hidden="true"></i>
                        <span>El técnico aún no ha definido el valor del servicio.</span>
                      </div>
                    )}
                  </div>

                  <footer className="solicitud-card__ubicacion">
                    <i className="bi bi-geo-alt-fill" aria-hidden="true"></i>
                    <div>
                      <span>Dirección del servicio</span>
                      <strong>{item.direccion_servicio}</strong>
                    </div>
                  </footer>
                </article>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClienteDashboard;