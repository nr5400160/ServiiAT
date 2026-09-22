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

        </div>

        <Outlet />

      </div>

    </div>
  );
};

export default AdminLayout;