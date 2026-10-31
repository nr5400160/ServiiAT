import { useNavigate } from "react-router-dom";

function MenuLateral() {
  const navigate = useNavigate();

  // obtener el email del usuario logueado desde localStorage
  const userEmail = localStorage.getItem("userEmail") || "admin@arservicio.com";

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    navigate("/Login");
  };

  return (
    <aside className="menu">
      <div className="colores">

        <h2 className="logo">AR Servicios Técnicos</h2><br />
        <p className="panel">Panel administrador</p>


        <div className="usuario">
          <i className="bi bi-person-circle"></i>

          <div className="info-usuario">
            <span className="nombre">Admin</span>
            <span className="correo">{userEmail}</span>
          </div>
        </div>

        <button onClick={() => navigate("/admin")}><i className="bi bi-house-add-fill"></i> Dashboard</button>
        <button onClick={() => navigate("/admin/configuracion")}><i className="bi bi-gear-wide-connected"></i> Configuración</button>

      </div>

      <button className="cerrar" onClick={cerrarSesion}>
        <i className="bi bi-unlock"></i> Cerrar sesión
      </button>
    </aside>
  );
}

export default MenuLateral;