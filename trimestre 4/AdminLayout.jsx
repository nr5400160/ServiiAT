import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import MenuLateral from "./MenuLateral";

const AdminLayout = () => {

  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {

    obtenerDatosAdmin();

  }, []);

  async function obtenerDatosAdmin() {

    try {

      const res = await fetch(
        'http://localhost:3001/api/admin/solicitudes'
      );

      const data = await res.json();

      console.log("DATOS ADMIN:", data);

      setSolicitudes(data);

    } catch (error) {

      console.log("ERROR ADMIN:", error);
    }
  }

  return (

    <div
      className="app"
      style={{ display: "flex" }}
    >

      <MenuLateral />

      <div className="contenido">

        <div className="p-3">

          <h3>
            Panel Administrador
          </h3>

          <p>
            Solicitudes encontradas:
            {" "}
            {solicitudes.length}
          </p>

          {
            solicitudes.map((solicitud) => (

              <div
                key={solicitud.id_solicitud}
                style={{
                  border: "1px solid gray",
                  marginBottom: "10px",
                  padding: "10px",
                  borderRadius: "10px"
                }}
              >

                <p>
                  <strong>Cliente:</strong>
                  {" "}
                  {solicitud.nombre_1}
                  {" "}
                  {solicitud.apellido_1}
                </p>

                <p>
                  <strong>Equipo:</strong>
                  {" "}
                  {solicitud.nombre_equipo}
                </p>

                <p>
                  <strong>Marca:</strong>
                  {" "}
                  {solicitud.marca_equipo}
                </p>

                <p>
                  <strong>Estado:</strong>
                  {" "}
                  {solicitud.nombre_estado}
                </p>

                <p>
                  <strong>Descripción:</strong>
                  {" "}
                  {solicitud.descripcion}
                </p>

                <p>
                  <strong>Dirección:</strong>
                  {" "}
                  {solicitud.direccion_servicio}
                </p>

                <p>
                  <strong>Fecha:</strong>
                  {" "}
                  {solicitud.fecha_solicitud}
                </p>

              </div>
            ))
          }

        </div>

        <Outlet />

      </div>

    </div>
  );
};

export default AdminLayout;