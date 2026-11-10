import { useNavigate } from "react-router-dom";

function MenuLateral() {
  const navigate = useNavigate();
  
  // 👉 CORRECCIÓN 1: Leer el correo desde sessionStorage, no de localStorage
  const userEmail = sessionStorage.getItem("userEmail") || "admin@arservicio.com";

  const cerrarSesion = () => {
    // Limpiamos absolutamente todo de la sesión
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("rol");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("id_usuario");
    sessionStorage.removeItem("userEmail");
    
    // 👉 CORRECCIÓN 2: Forzar recarga completa para limpiar la memoria de React
    window.location.href = "/Login";
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

        {/* BOTONES DE NAVEGACIÓN INDEPENDIENTES */}
        <button onClick={() => navigate("/admin")}>
          <i className="bi bi-card-list"></i> Gestión de Solicitudes
        </button>

        <button onClick={() => navigate("/admin/historial")}>
          <i className="bi bi-clock-history"></i> Historial
        </button>
        
        <button onClick={() => navigate("/admin/registrar-personal")}>
          <i className="bi bi-person-plus-fill"></i> Registrar Personal
        </button>

        <button onClick={() => navigate("/admin/configuracion")}>
          <i className="bi bi-gear-wide-connected"></i> Configuración
        </button>
      </div>

      <button className="cerrar" onClick={cerrarSesion}>
        <i className="bi bi-unlock"></i> Cerrar sesión
      </button>
    </aside>
  );
}

export default MenuLateral;