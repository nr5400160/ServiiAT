import { NavLink, useNavigate } from "react-router-dom";

function Navbar({ setEstaAutenticado }) {
  const navigate = useNavigate();

  const estaAutenticado = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");

    setEstaAutenticado(false);
    navigate('/');
  };

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
          <ul className="navbar-nav ms-auto">

            {/* INICIO */}
            <li className="nav-item me-2">
              <NavLink
                to="/Index"
                className={({ isActive }) => `nav-link px-3 ${isActive ? 'fw-bold btn px-4 py-2 rounded-3 text-white' : 'text-secondary'}`}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? '#E57373' : 'transparent',
                  border: 'none'
                })}
              >
                Inicio
              </NavLink>
            </li>

            {/* SERVICIOS */}
            <li className="nav-item">
              <NavLink
                to="/ServiciosNav"
                className={({ isActive }) => `nav-link px-3 ${isActive ? 'fw-bold btn px-4 py-2 rounded-3 text-white' : 'text-secondary'}`}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? '#E57373' : 'transparent',
                  border: 'none'
                })}
              >
                Servicios
              </NavLink>
            </li>

            {/* ACERCA */}
            <li className="nav-item">
              <NavLink
                to="/AcerdaDeNosotros"
                className={({ isActive }) => `nav-link px-3 ${isActive ? 'fw-bold btn px-4 py-2 rounded-3 text-white' : 'text-secondary'}`}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? '#E57373' : 'transparent',
                  border: 'none'
                })}
              >
                Acerca de nosotros
              </NavLink>
            </li>

            {/* SOLICITAR (PROTEGIDO) */}
            <li className="nav-item">
              <NavLink
                to={estaAutenticado ? "/infoUsuario" : "/Registro"}
                className={({ isActive }) => `nav-link px-3 ${isActive ? 'fw-bold btn px-4 py-2 rounded-3 text-white' : 'text-secondary'}`}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? '#E57373' : 'transparent',
                  border: 'none'
                })}
              >
                Solicitar
              </NavLink>
            </li>

            {/* LOGIN / REGISTRO o LOGOUT */}
            {!estaAutenticado ? (
              <>
                <li className="nav-item">
                  <button
                    onClick={() => navigate('/Login')}
                    className="btn btn-outline-dark ms-2 border-0"
                    style={{ fontWeight: 'bold' }}
                  >
                    Iniciar sesión
                  </button>
                </li>

                <li className="nav-item">
                  <button
                    onClick={() => navigate('/Registro')}
                    className="btn ms-2 text-white fw-bold px-4 rounded-pill"
                    style={{ backgroundColor: '#E57373', border: 'none' }}
                  >
                    Registrarse
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item d-flex align-items-center border-start ps-3 ms-2">
                <button 
                  className="btn btn-link nav-link text-danger border-0 p-0"
                  onClick={handleLogout}
                  style={{ textDecoration: 'none', fontSize: '0.9rem' }}
                >
                  Cerrar Sesión
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