import { useLocation, useNavigate } from "react-router-dom";

function MenuLateral() {
  const navigate = useNavigate();
  const location = useLocation();
  const userEmail = sessionStorage.getItem("userEmail") || "admin@arservicio.com";

  const rutas = [
    { path: "/admin", label: "Solicitudes", icon: "bi-clipboard-check", exact: true },
    { path: "/admin/historial", label: "Historial", icon: "bi-clock-history" },
    { path: "/admin/registrar-personal", label: "Registrar personal", icon: "bi-person-plus" },
    { path: "/admin/configuracion", label: "Configuración", icon: "bi-gear" },
    { path: "/perfil", label: "Mi perfil", icon: "bi-person-gear" }
  ];

  const rutaActiva = (ruta) => (
    ruta.exact
      ? location.pathname === ruta.path
      : location.pathname === ruta.path || location.pathname.startsWith(`${ruta.path}/`)
  );

  const cerrarSesion = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("rol");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("id_usuario");
    sessionStorage.removeItem("userEmail");
    window.location.href = "/Login";
  };

  return (
    <aside className="menu">
      <div className="menu__contenido">
        <div className="menu__marca">
          <span className="menu__marca-icono"><i className="bi bi-tools" aria-hidden="true"></i></span>
          <div>
            <strong>AR Servicios</strong>
            <span>Técnicos</span>
          </div>
        </div>

        <div className="menu__usuario">
          <span className="menu__avatar"><i className="bi bi-person-fill" aria-hidden="true"></i></span>
          <div>
            <strong>Administrador</strong>
            <span>{userEmail}</span>
          </div>
        </div>

        <p className="menu__seccion">MENÚ PRINCIPAL</p>
        <nav className="menu__navegacion" aria-label="Navegación de administrador">
          {rutas.map((ruta) => (
            <button
              key={ruta.path}
              className={`menu__enlace ${rutaActiva(ruta) ? "menu__enlace--activo" : ""}`}
              onClick={() => navigate(ruta.path)}
              aria-current={rutaActiva(ruta) ? "page" : undefined}
            >
              <i className={`bi ${ruta.icon}`} aria-hidden="true"></i>
              <span>{ruta.label}</span>
              {rutaActiva(ruta) && <i className="bi bi-chevron-right menu__flecha" aria-hidden="true"></i>}
            </button>
          ))}
        </nav>
      </div>

      <button className="cerrar menu__salir" onClick={cerrarSesion}>
        <i className="bi bi-box-arrow-left" aria-hidden="true"></i>
        <span>Cerrar sesión</span>
      </button>
    </aside>
  );
}

export default MenuLateral;