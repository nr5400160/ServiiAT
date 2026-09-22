import { useEffect, useState } from "react";

function ClienteDashboard() {
  const [versiones, setVersiones] = useState([]);
  const [filtro, setFiltro] = useState("Todos");

  const userEmail = localStorage.getItem("userEmail") || "";
  const API = "https://69d82a490576c93882592a63.mockapi.io/Formulrio";

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => {
        // Filtrar solo las solicitudes del usuario logueado
        const misServicios = data.filter(item => item.gmail === userEmail);
        setVersiones(misServicios);
      })
      .catch(err => console.log(err));
  }, [userEmail]);

  const pendientes = versiones.filter(v => v.estado === "Pendiente").length;
  const proceso = versiones.filter(v => v.estado === "En Proceso").length;
  const completado = versiones.filter(v => v.estado === "Completado").length;
  const cancelado = versiones.filter(v => v.estado === "Cancelado").length;

  const filtrados =
    filtro === "Todos"
      ? versiones
      : versiones.filter(v => v.estado === filtro);

  return (
    <div className="container mt-4">

      <div
        className="p-4 rounded shadow text-white mb-4"
        style={{
          background: "linear-gradient(90deg, #2c4da7, #4a7de0)"
        }}
      >
        <h4 className="mb-1">📋 Historial de Servicios</h4>
        <small>ServiAT</small>
      </div>

      <div className="row text-center mb-4">

        <div className="col">
          <div className="p-3 bg-warning rounded shadow-sm">
            <h6>Pendientes</h6>
            <h4>{pendientes}</h4>
          </div>
        </div>

        <div className="col">
          <div className="p-3 bg-primary text-white rounded shadow-sm">
            <h6>En Proceso</h6>
            <h4>{proceso}</h4>
          </div>
        </div>

        <div className="col">
          <div className="p-3 bg-success text-white rounded shadow-sm">
            <h6>Completados</h6>
            <h4>{completado}</h4>
          </div>
        </div>

        <div className="col">
          <div className="p-3 bg-danger text-white rounded shadow-sm">
            <h6>Cancelados</h6>
            <h4>{cancelado}</h4>
          </div>
        </div>

      </div>

      <div className="mb-4 d-flex gap-2 flex-wrap">
        {["Todos", "Pendiente", "En Proceso", "Completado", "Cancelado"].map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`btn ${filtro === f ? "btn-dark" : "btn-outline-dark"
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtrados.map((item) => (
        <div
          key={item.id}
          className="mb-4 p-3 rounded shadow-sm"
          style={{ background: "#f8f9fc" }}
        >

          <div className="d-flex justify-content-between">

            <div>
              <h5 className="fw-bold mb-0">
                {item.servicio} - {item.equipo}
              </h5>
              <small className="text-muted">
                👤 {item.nombreCliente}
              </small>
            </div>

            <span
              className={
                "badge px-3 py-2 " +
                (item.estado === "Pendiente"
                  ? "bg-warning text-dark"
                  : item.estado === "En Proceso"
                    ? "bg-primary"
                    : item.estado === "Completado"
                      ? "bg-success"
                      : "bg-danger")
              }
            >
              {item.estado}
            </span>
          </div>

          <div className="text-muted mt-2">
            📅 {item.fecha} ⏰ {item.hora}
          </div>

          <div
            className="mt-3 p-3"
            style={{
              background: "#e9edf5",
              borderRadius: "10px"
            }}
          >
            {item.descripcion}
          </div>

          <div className="d-flex justify-content-between mt-3">

            <div>
              <small className="text-muted">👨‍🔧 Técnico</small>
              <p className="fw-bold mb-0">
                {item.tecnico || "No asignado"}
              </p>
            </div>

            <div className="text-end">
              <small className="text-muted">💰 Precio</small>
              <p className="fw-bold text-success mb-0">
                ${item.precio || "0"}
              </p>
            </div>

          </div>

        </div>
      ))}
    </div>
  );
}

export default ClienteDashboard;