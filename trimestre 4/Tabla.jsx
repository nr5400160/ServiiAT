import { useState } from "react";

const API_ADMIN_URL = "http://localhost:3001/api/admin/solicitudes";

function Tabla({ reservas, setReservas }) {
  const [reservaVisualizada, setReservaVisualizada] = useState(null);

  const [editandoId, setEditandoId] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const editarReserva = (reserva) => {
    setEditandoId(reserva.id_solicitud);
    setNuevoEstado(reserva.nombre_estado);
    setError("");
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setError("");
  };

  const guardarEdicion = async (reserva) => {
    setGuardando(true);
    setError("");

    try {
      const res = await fetch(
      `${API_ADMIN_URL}/${reserva.id_solicitud}`,
     {
      method: "PUT",
     headers: {
       "Content-Type": "application/json"
      },
  body: JSON.stringify({
  estado: nuevoEstado,
  tecnicoId: 1
})
   }
);
      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      setReservas(prev =>
        prev.map(r =>
          r.id_solicitud === reserva.id_solicitud
            ? { ...r, nombre_estado: nuevoEstado }
            : r
        )
      );

      setEditandoId(null);

    } catch (err) {
      console.error(err);
      setError("No se pudo actualizar la solicitud");
    } finally {
      setGuardando(false);
    }
  };

  const eliminarReserva = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar esta solicitud?"
    );

    if (!confirmar) return;

    try {
      const res = await fetch(
        `${API_ADMIN_URL}/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      setReservas(prev =>
        prev.filter(r => r.id_solicitud !== id)
      );

    } catch (err) {
      console.error(err);
      setError(
        "No se pudo eliminar la solicitud. Revisa la consola."
      );
    }
  };

  return (
    <>
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div className="table-responsive">
        <table className="table tabla-admin align-middle">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Equipo</th>
              <th>Fecha</th>
              <th>Dirección</th>
              <th>Estado</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {reservas.map((r) => (
              <tr key={r.id_solicitud}>
                <td>
                  {r.nombre_1} {r.apellido_1}
                </td>

                <td>{r.nombre_equipo}</td>

                <td>
                  {r.fecha_solicitud
                    ? new Date(
                        r.fecha_solicitud
                      ).toLocaleDateString("es-CO", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                      })
                    : "—"}
                </td>

                <td>{r.direccion_servicio}</td>

                <td>
                  {editandoId === r.id_solicitud ? (
                    <select
                      className="form-select"
                      value={nuevoEstado}
                      onChange={(e) =>
                        setNuevoEstado(e.target.value)
                      }
                    >
                      <option>Pendiente</option>
                      <option>En proceso</option>
                      <option>Finalizado</option>
                      <option>Cancelado</option>
                    </select>
                  ) : (
                    <span className="badge bg-primary">
                      {r.nombre_estado}
                    </span>
                  )}
                </td>

                <td className="acciones">
                  <button
                    className="btn-accion btn-ver"
                    onClick={() => setReservaVisualizada(r)}
                    title="Ver detalle"
                  >
                    <i className="bi bi-eye-fill"></i>
                  </button>

                  {editandoId === r.id_solicitud ? (
                    <>
                      <button
                        className="btn-accion btn-guardar"
                        onClick={() => guardarEdicion(r)}
                        disabled={guardando}
                        title="Guardar"
                      >
                        <i className="bi bi-check-lg"></i>
                      </button>

                      <button
                        className="btn-accion btn-cancelar"
                        onClick={cancelarEdicion}
                        title="Cancelar"
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn-accion btn-editar"
                      onClick={() => editarReserva(r)}
                      title="Editar"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  )}

                  <button
                    className="btn-accion btn-eliminar"
                    onClick={() =>
                      eliminarReserva(r.id_solicitud)
                    }
                    title="Eliminar"
                  >
                    <i className="bi bi-trash-fill"></i>
                  </button>
                </td>
              </tr>
            ))}

            {reservas.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-center p-4"
                >
                  No hay solicitudes registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {reservaVisualizada && (
        <div
          className="modal"
          onClick={() =>
            setReservaVisualizada(null)
          }
        >
          <div
            className="modal-contenido"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              className="cerrar-modal"
              onClick={() =>
                setReservaVisualizada(null)
              }
            >
              ✕
            </button>

            <h3>📋 Detalle de Solicitud</h3>

            <p>
              <strong>Cliente:</strong>{" "}
              {reservaVisualizada.nombre_1}{" "}
              {reservaVisualizada.apellido_1}
            </p>

            <p>
              <strong>Equipo:</strong>{" "}
              {reservaVisualizada.nombre_equipo}
            </p>

            <p>
              <strong>Dirección:</strong>{" "}
              {reservaVisualizada.direccion_servicio}
            </p>

            <p>
              <strong>Fecha:</strong>{" "}
              {new Date(
                reservaVisualizada.fecha_solicitud
              ).toLocaleDateString("es-CO")}
            </p>

            <p>
              <strong>Descripción:</strong>{" "}
              {reservaVisualizada.descripcion}
            </p>

            <p>
              <strong>Estado:</strong>{" "}
              {reservaVisualizada.nombre_estado}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Tabla;