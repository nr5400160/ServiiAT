import { NavLink, useNavigate } from "react-router-dom";

function Navbar({ setEstaAutenticado, setRol }) {
  const navigate = useNavigate();

  const estaAutenticado = sessionStorage.getItem("token");
  const rol = sessionStorage.getItem("rol");

  const handleLogout = () => {
    // Limpiamos todas las variables correctas de la sesión actual
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("rol");
    sessionStorage.removeItem("id_usuario");
    sessionStorage.removeItem("user");

    setEstaAutenticado(false);
    if (setRol) setRol(null);
    navigate('/');
  };

  // Estilos reutilizables para los botones del menú superior
  const estiloActivo = (isActive) => ({
    backgroundColor: isActive ? '#E57373' : 'transparent',
    border: 'none',
    color: isActive ? 'white' : '#6c757d'
  });
  const claseActiva = (isActive) => `nav-link px-3 ${isActive ? 'fw-bold btn px-4 py-2 rounded-3 text-white' : 'text-secondary'}`;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3">
      <div className="container-fluid px-4">
        <NavLink className="navbar-brand fw-bold" to="/" style={{ color: '#E57373' }}>
          AR SERVICIO TÉCNICO
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menuNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="menuNavbar">
          <ul className="navbar-nav ms-auto align-items-center">

            {/* MENÚ ADMINISTRADOR */}
            {rol === 'administrador' ? (
              <>
                <li className="nav-item me-2">
                  <NavLink to="/admin" end className={({ isActive }) => claseActiva(isActive)} style={({ isActive }) => estiloActivo(isActive)}>
                    Gestión de Solicitudes
                  </NavLink>
                </li>
                <li className="nav-item me-2">
                  <NavLink to="/admin/historial" className={({ isActive }) => claseActiva(isActive)} style={({ isActive }) => estiloActivo(isActive)}>
                    Historial
                  </NavLink>
                </li>
                <li className="nav-item me-2">
                  <NavLink to="/admin/configuracion" className={({ isActive }) => claseActiva(isActive)} style={({ isActive }) => estiloActivo(isActive)}>
                    Configuración
                  </NavLink>
                </li>
              </>
            ) : rol === 'tecnico' ? (
              /* MENÚ TÉCNICO */
              <li className="nav-item me-2">
                <NavLink to="/tecnico" className={({ isActive }) => claseActiva(isActive)} style={({ isActive }) => estiloActivo(isActive)}>
                  Panel de Técnico
                </NavLink>
              </li>
            ) : (
              /* MENÚ CLIENTE / PÚBLICO */
              <>
                <li className="nav-item me-2">
                  <NavLink to="/" className={({ isActive }) => claseActiva(isActive)} style={({ isActive }) => estiloActivo(isActive)}>
                    Inicio
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/ServiciosNav" className={({ isActive }) => claseActiva(isActive)} style={({ isActive }) => estiloActivo(isActive)}>
                    Servicios
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/AcercaDeNosotros" className={({ isActive }) => claseActiva(isActive)} style={({ isActive }) => estiloActivo(isActive)}>
                    Acerca de nosotros
                  </NavLink>
                </li>
                {estaAutenticado && (
                  <li className="nav-item me-2">
                    <NavLink to="/ClienteHistorial" className={({ isActive }) => claseActiva(isActive)} style={({ isActive }) => estiloActivo(isActive)}>
                      Mis Solicitudes
                    </NavLink>
                  </li>
                )}
                <li className="nav-item">
                  <NavLink to={estaAutenticado ? "/infoUsuario" : "/Registro"} className={({ isActive }) => claseActiva(isActive)} style={({ isActive }) => estiloActivo(isActive)}>
                    Solicitar
                  </NavLink>
                </li>
              </>
            )}

            {/* ZONA DE LOGIN / LOGOUT PARA TODOS */}
            {!estaAutenticado ? (
              <>
                <li className="nav-item">
                  <button onClick={() => navigate('/Login')} className="btn btn-outline-dark ms-2 border-0" style={{ fontWeight: 'bold' }}>
                    Iniciar sesión
                  </button>
                </li>
                <li className="nav-item">
                  <button onClick={() => navigate('/Registro')} className="btn ms-2 text-white fw-bold px-4 rounded-pill" style={{ backgroundColor: '#E57373', border: 'none' }}>
                    Registrarse
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item d-flex align-items-center border-start ps-3 ms-2 mt-2 mt-lg-0">
                <button 
                  className="btn btn-link nav-link text-danger border-0 p-0 fw-bold"
                  onClick={handleLogout}
                  style={{ textDecoration: 'none', fontSize: '0.9rem' }}
                >
                  <i className="bi bi-box-arrow-right me-1"></i> Cerrar Sesión
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;