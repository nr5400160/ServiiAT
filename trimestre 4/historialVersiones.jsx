import { useEffect, useState } from "react";
import "../App.css";

function HistorialVersiones() {

  const [versiones, setVersiones] = useState([]);
  const [filtro, setFiltro] = useState("Todos");

  useEffect(() => {

    obtenerHistorial();

  }, []);

  async function obtenerHistorial() {

    try {

      const res = await fetch(
        "http://localhost:3001/api/historial"
      );

      const data = await res.json();

      console.log(
        "DATOS HISTORIAL:",
        data
      );

      const datosAdaptados = data.map((item) => ({

        id:
          item.id_solicitud,

        version:
          item.nombre_equipo || "Sin equipo",

        fecha:
          item.fecha_solicitud,

        descripcion:
          item.descripcion,

        estado:
          item.nombre_estado || "Pendiente",

        direccion:
          item.direccion_servicio,

        cliente:
          item.nombre_1 +
          " " +
          item.apellido_1,

        marca:
          item.marca_equipo || "",

        modelo:
          item.modelo_equipo || ""

      }));

      setVersiones(datosAdaptados);

    } catch (error) {

      console.log(
        "ERROR HISTORIAL:",
        error
      );
    }
  }

  const datosFiltrados =

    filtro === "Todos"

      ? versiones

      : versiones.filter(

          item =>
            item.estado === filtro
        );

  const total = versiones.length;

  const pendientes =

    versiones.filter(

      v =>
        v.estado === "Pendiente"

    ).length;

  const proceso =

    versiones.filter(

      v =>
        v.estado === "En Proceso"

    ).length;

  const completados =

    versiones.filter(

      v =>
        v.estado === "Completado"

    ).length;

  const cancelados =

    versiones.filter(

      v =>
        v.estado === "Cancelado"

    ).length;

  return (

    <div className="historial-container p-3">

      <div className="historial-header">

        <h4>
          Historial de Solicitudes
        </h4>

      </div>

      <div className="mb-3 filtros">

        <button
          onClick={() => setFiltro("Todos")}
          className={
            filtro === "Todos"
              ? "activo"
              : ""
          }
        >
          Todos ({total})
        </button>

        <button
          onClick={() => setFiltro("Pendiente")}
          className={
            filtro === "Pendiente"
              ? "activo"
              : ""
          }
        >
          Pendiente ({pendientes})
        </button>

        <button
          onClick={() => setFiltro("En Proceso")}
          className={
            filtro === "En Proceso"
              ? "activo"
              : ""
          }
        >
          En Proceso ({proceso})
        </button>

        <button
          onClick={() => setFiltro("Completado")}
          className={
            filtro === "Completado"
              ? "activo"
              : ""
          }
        >
          Completado ({completados})
        </button>

        <button
          onClick={() => setFiltro("Cancelado")}
          className={
            filtro === "Cancelado"
              ? "activo"
              : ""
          }
        >
          Cancelado ({cancelados})
        </button>

      </div>

      {datosFiltrados.map((item) => (

        <div
          key={item.id}
          className="card-custom"
        >

          <div className="d-flex justify-content-between">

            <strong>
              {item.version}
            </strong>

            <span
              className={
                "badge-estado " +

                (
                  item.estado === "Pendiente"

                  ? "badge-pendiente"

                  : item.estado === "En Proceso"

                  ? "badge-proceso"

                  : item.estado === "Completado"

                  ? "badge-completado"

                  : "badge-cancelado"
                )
              }
            >
              {item.estado}
            </span>

          </div>

          <small className="text-muted">
            {item.fecha}
          </small>

          <p className="descripcion mt-2">
            {item.descripcion}
          </p>

          <p>
            <strong>Dirección:</strong>{" "}
            {item.direccion}
          </p>

          <p>
            <strong>Cliente:</strong>{" "}
            {item.cliente}
          </p>

          <p>
            <strong>Marca:</strong>{" "}
            {item.marca}
          </p>

          <p>
            <strong>Modelo:</strong>{" "}
            {item.modelo}
          </p>

        </div>
      ))}

    </div>
  );
}

export default HistorialVersiones;