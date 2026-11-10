import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';

// Componentes del cliente y generales
import InformacionPaso1 from './components/client/infoFormulario';
import Formulario from "./components/client/solicitudFormulario";
import ValidarInformacion from "./components/client/validarServicio";
import ServicioConfirmado from "./components/client/servicioConfirmado";
import Pago from "./components/client/pago";
import Stepper from "./components/client/steppers";

// Componentes comunes
import Footer from "./components/common/footer";
import Navbar from "./components/common/navVar";

// Componentes del Administrador
import AdminLayout from "./components/dashboard/AdminLayout";
import RegistroAdmin from "./components/dashboard/RegistroAdmin";

// Páginas principales
import Index from './pages/index';
import Login from './pages/login';
import TecnicoDashboard from './pages/TecnicoDashboard';
import Registro from './pages/registro';
import ServiciosNav from './pages/serviciosNav';
import AcercaDeNosotros from './pages/acercaNosotros';
import ClienteDashboard from "./pages/ClienteDashboard";
import Configuracion from "./pages/Configuracion";
import AdminDashboard from "./pages/AdminDashboard"; 
import HistorialVersiones from "./pages/HistorialVersiones";
import './App.css';
import "./index.css";

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 👉 CORRECCIÓN 1: Cambiado localStorage por sessionStorage al iniciar el estado
  const [estaAutenticado, setEstaAutenticado] = useState(!!sessionStorage.getItem("token"));
  const [rol, setRol] = useState(sessionStorage.getItem("rol")); 

  const rutasConStepper = ['/infoUsuario', '/Formulario', '/ValidarInformacion', '/ServicioConfirmado'];
  const mostrarStepper = rutasConStepper.includes(location.pathname);

  // Controlador global de inactividad (15 minutos)
  useEffect(() => {
    if (!estaAutenticado) return; 

    let timeoutId;

    const cerrarSesionPorInactividad = () => {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("rol");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("id_usuario");
      sessionStorage.removeItem("userEmail");
      
      setEstaAutenticado(false);
      setRol(null);
      
      alert("Tu sesión ha expirado por inactividad de 15 minutos.");
      navigate("/Login");
    };

    const reiniciarContador = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(cerrarSesionPorInactividad, 900000); // 900000 ms = 15 minutos
    };

    const eventos = ["mousemove", "keydown", "click", "scroll"];
    eventos.forEach((evento) => window.addEventListener(evento, reiniciarContador));

    reiniciarContador(); 

    return () => {
      clearTimeout(timeoutId);
      eventos.forEach((evento) => window.removeEventListener(evento, reiniciarContador));
    };
  }, [estaAutenticado, navigate]);

  // GUARDIA DE RUTAS
  const RutaPublica = ({ children }) => {
    if (estaAutenticado && rol === 'administrador') return <Navigate to="/admin" replace />;
    if (estaAutenticado && rol === 'tecnico') return <Navigate to="/tecnico" replace />;
    return children;
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      
      {/* 👉 CORRECCIÓN 2: Ocultar Navbar para Admin y Técnico */}
      {!location.pathname.startsWith('/admin') && !location.pathname.startsWith('/tecnico') && (
        <Navbar setEstaAutenticado={setEstaAutenticado} setRol={setRol} />
      )}
      
      <main className="flex-grow-1">
        {mostrarStepper && <Stepper />}
        
        <Routes>
          {/* RUTAS PÚBLICAS */}
          <Route path="/" element={<RutaPublica><Index /></RutaPublica>} />
          <Route path="/index" element={<RutaPublica><Index /></RutaPublica>} />
          <Route path="/ServiciosNav" element={<RutaPublica><ServiciosNav /></RutaPublica>} />
          <Route path="/AcercaDeNosotros" element={<RutaPublica><AcercaDeNosotros /></RutaPublica>} />
          
          {/* LOGIN Y REGISTRO */}
          <Route path="/Login" element={estaAutenticado ? <Navigate to="/" replace /> : <Login setEstaAutenticado={setEstaAutenticado} setRol={setRol} />} />
          <Route path="/Registro" element={estaAutenticado ? <Navigate to="/" replace /> : <Registro />} />
          
          <Route path="/Pago" element={<Pago />} />
          
          {/* RUTAS EXCLUSIVAS DEL CLIENTE */}
          <Route path="/infoUsuario" element={estaAutenticado && (!rol || rol === 'cliente') ? <InformacionPaso1 /> : <Navigate to="/Login" />} />
          <Route path="/Formulario" element={estaAutenticado && (!rol || rol === 'cliente') ? <Formulario /> : <Navigate to="/Login" />} />
          <Route path="/ValidarInformacion" element={estaAutenticado && (!rol || rol === 'cliente') ? <ValidarInformacion /> : <Navigate to="/Login" />} />
          <Route path="/ServicioConfirmado" element={estaAutenticado && (!rol || rol === 'cliente') ? <ServicioConfirmado /> : <Navigate to="/Login" />} />
          <Route path="/ClienteHistorial" element={estaAutenticado && (!rol || rol === 'cliente') ? <ClienteDashboard /> : <Navigate to="/Login" />} />
          
          {/* RUTA DEL TÉCNICO */}
          <Route path="/tecnico" element={estaAutenticado && rol === 'tecnico' ? <TecnicoDashboard /> : <Navigate to="/Login" />} />
          
          {/* RUTAS DEL ADMINISTRADOR */}
          <Route path="/admin" element={estaAutenticado && rol === 'administrador' ? <AdminLayout /> : <Navigate to="/Login" />} >
            <Route index element={<AdminDashboard />} /> 
            <Route path="historial" element={<HistorialVersiones />} />
            <Route path="registrar-personal" element={<RegistroAdmin />} />
            <Route path="configuracion" element={<Configuracion />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      
      {/* Ocultar Footer para Admin y Técnico */}
      {!location.pathname.startsWith('/admin') && !location.pathname.startsWith('/tecnico') && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;