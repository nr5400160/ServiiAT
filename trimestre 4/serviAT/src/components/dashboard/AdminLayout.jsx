import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import MenuLateral from "./MenuLateral";
import { cliente } from "../../supabase/cliente";

const AdminLayout = () => {

  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    obtenerDatosAdmin();
  }, []);

  async function obtenerDatosAdmin() {

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
          marca_equipo
        ),

        cliente:usuario_id_cliente (
          nombre_1,
          apellido_1
        )
      `);

    if (error) {

      console.log("ERROR ADMIN:", error);

    } else {

      console.log("DATOS ADMIN:", data);

      setSolicitudes(data);
    }
  }

  return (

    <div
      className="app"
      style={{ display: "flex" }}
    >

      <MenuLateral />

      <div className="contenido">

        {/* PRUEBA CONEXIÓN SUPABASE */}
        <div className="p-3">

          <h3>
            Panel Administrador
          </h3>

          <p>
            Solicitudes encontradas:
            {" "}
            {solicitudes.length}
          </p>

        </div>

        <Outlet />

      </div>

    </div>
  );
};

export default AdminLayout;