import { useEffect, useState } from "react";
import "../App.css";
import { cliente } from "../../supabase/cliente";

function HistorialVersiones() {

  const [versiones, setVersiones] = useState([]);
  const [filtro, setFiltro] = useState("Todos");

  useEffect(() => {
    obtenerHistorial();
  }, []);

  async function obtenerHistorial() {

    const { data, error } = await cliente
      .from("solicitud")
      .select(`
        id_solicitud,
        fecha_solicitud,
        descripcion,
        direccion_servicio,

        estado:id_estado_solicitud (
          nombre_estado
        ),

        equipo:id_equipo (
          nombre_equipo,
          marca_equipo,
          modelo_equipo
        ),

        cliente:usuario_id_cliente (
          nombre_1,
          apellido_1
        )
      `);

    if (error) {

      console.log("ERROR:", error);

    } else {

      console.log("DATOS:", data);

      const datosAdaptados = data.map((item) => ({

        id: item.id_solicitud,

        version:
          item.equipo?.nombre_equipo || "Sin equipo",

        fecha:
          item.fecha_solicitud,

        descripcion:
          item.descripcion,

        estado:
          item.estado?.nombre_estado || "Pendiente",

        direccion:
          item.direccion_servicio,

        cliente:
          item.cliente
            ? item.cliente.nombre_1 +
              " " +
              item.cliente.apellido_1
            : "Sin cliente",

        marca:
          item.equipo?.marca_equipo || "",

        modelo:
          item.equipo?.modelo_equipo || ""

      }));

      setVersiones(datosAdaptados);
    }
  }

  const datosFiltrados =
    filtro === "Todos"
      ? versiones
      : versiones.filter(
          item => item.estado === filtro
        );

  const total = versiones.length;

  const pendientes =
    versiones.filter(
      v => v.estado === "Pendiente"
    ).length;

  const proceso =
    versiones.filter(
      v => v.estado === "En Proceso"
    ).length;

  const completados =
    versiones.filter(
      v => v.estado === "Completado"
    ).length;

  const cancelados =
    versiones.filter(
      v => v.estado === "Cancelado"
    ).length;

  return (

    <div className="historial-container p-3">

      <div className="historial-header">
        <h4>Historial de Solicitudes</h4>
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

                (item.estado === "Pendiente"
                  ? "badge-pendiente"

                  : item.estado === "En Proceso"
                  ? "badge-proceso"

                  : item.estado === "Completado"
                  ? "badge-completado"

                  : "badge-cancelado")
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