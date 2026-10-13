import { useState } from "react";

function Tabla({ reservas, setReservas }) {
  const [reservaVisualizada, setReservaVisualizada] = useState(null);

  const [editandoId, setEditandoId] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState("");

  const editarReserva = (reserva) => {
    setEditandoId(reserva.id);
    setNuevoEstado(reserva.estado);
  };

  const guardarEdicion = async (reserva) => {
    await fetch(`https://69d82a490576c93882592a63.mockapi.io/Formulrio/${reserva.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...reserva, estado: nuevoEstado })
    });

    setReservas(prev => prev.map(r =>
      r.id === reserva.id ? { ...r, estado: nuevoEstado } : r
    ));

    setEditandoId(null);
  };

  const eliminarReserva = async (id) => {
    try {
      await fetch(`https://69d82a490576c93882592a63.mockapi.io/Formulrio/${id}`, {
        method: "DELETE"
      });

      setReservas(prev => prev.filter(r => r.id !== id));

    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Servicio</th>
            <th>Fecha</th>
            <th>Dirección</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {reservas.map(r => (
            <tr key={r.id}>
              <td>{r.nombreCliente}</td>
              <td>{r.servicio}</td>

              <td>
                {new Date(r.fecha).toLocaleDateString("es-CO", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric"
                })}
              </td>

              <td>{r.direccion}</td>

              <td>
                {editandoId === r.id ? (
                  <select
                    value={nuevoEstado}
                    onChange={(e) => setNuevoEstado(e.target.value)}
                  >
                    <option>Pendiente</option>
                    <option>En Proceso</option>
                    <option>Completadas</option>
                    <option>Cancelado</option>
                    <option>Servicios</option>
                  </select>
                ) : (
                  r.estado
                )}
              </td>

              <td>
                <button className="btn-ver" onClick={() => setReservaVisualizada(r)}>
                  <i className="bi bi-eye"></i>
                </button>

                {editandoId === r.id ? (
                  <button className="btn-editar" onClick={() => guardarEdicion(r)}>
                    💾
                  </button>
                ) : (
                  <button className="btn-editar" onClick={() => editarReserva(r)}>
                    <i className="bi bi-pencil"></i>
                  </button>
                )}

                <button className="btn-eliminar" onClick={() => eliminarReserva(r.id)}>
                  <i className="bi bi-trash3"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {reservaVisualizada && (
        <div className="modal" onClick={() => setReservaVisualizada(null)}>
          <div className="modal-contenido" onClick={e => e.stopPropagation()}>
            <button className="cerrar-modal" onClick={() => setReservaVisualizada(null)}>X</button>
            <h3>Detalle de Solictud</h3>
            <p><b>Cliente:</b> {reservaVisualizada.nombreCliente}</p>
            <p><b>Teléfono:</b> {reservaVisualizada.telefono}</p>
            <p><b>Dirección:</b> {reservaVisualizada.direccion}</p>
            <p><b>Electrodoméstico:</b> {reservaVisualizada.servicio}</p>

            <p>
              <b>Fecha:</b>{" "}
              {new Date(reservaVisualizada.fecha).toLocaleDateString("es-CO", {
                day: "2-digit",
                month: "long",
                year: "numeric"
              })}
            </p>

            <p><b>Descripción:</b> {reservaVisualizada.descripcion}</p>
            <p><b>Creado el:</b> {new Date(reservaVisualizada.createdAt).toLocaleString()}</p>
            <p><b>Estado:</b> {reservaVisualizada.estado}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default Tabla;