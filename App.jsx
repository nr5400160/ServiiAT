import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState } from 'react';

// Importaciones de componentes
import InformacionPaso1 from './components/infoFormulario';
import Formulario from "./components/solicitudFormulario";
import Footer from "./components/footer";
import Navbar from "./components/navVar";
import ServiciosNav from "./components/serviciosNav";
import Registro from './components/registro';
import AcercaDeNosotros from "./components/acercaNosotros";
import Index from './components/index';
import Login from './components/login';

import ValidarInformacion from "./components/validarServicio";
import ServicioConfirmado from "./components/servicioConfirmado";

// Dashboards y Admin
import ClienteDashboard from "./pages/ClienteDashboard";
import Configuracion from "./pages/Configuracion";
import AdminLayout from "./components/dashboard/AdminLayout";
import Stepper from "./components/steppers";

import './App.css';
import "./index.css";
import Dashboard from "./pages/Dashboard";

function AppContent() {
  const location = useLocation();
  const [estaAutenticado, setEstaAutenticado] = useState(!!localStorage.getItem("token"));

  const rutasConStepper = ['/infoUsuario', '/Formulario', '/ValidarInformacion', '/ServicioConfirmado'];
  const mostrarStepper = rutasConStepper.includes(location.pathname);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar setEstaAutenticado={setEstaAutenticado} />

      <main className="flex-grow-1">
        {mostrarStepper && <Stepper />}

        <Routes>
          {/* RUTAS PÚBLICAS (Accesibles para todos) */}
          <Route path="/" element={<Index />} />
          <Route path="/index" element={<Index />} />
          <Route path="/ServiciosNav" element={<ServiciosNav />} />
          <Route path="/AcerdaDeNosotros" element={<AcercaDeNosotros />} />
          <Route path="/Login" element={<Login setEstaAutenticado={setEstaAutenticado} />} />
          <Route path="/Registro" element={<Registro />} />

          {/* RUTAS DE SOLICITUD (Públicas según tu flujo original) */}
          <Route path="/infoUsuario" element={<InformacionPaso1 />} />
          <Route path="/Formulario" element={<Formulario />} />
          <Route path="/ValidarInformacion" element={<ValidarInformacion />} />
          <Route path="/ServicioConfirmado" element={<ServicioConfirmado />} />

          {/* RUTA PROTEGIDA: CLIENTE */}
          <Route
            path="/ClienteHistorial"
            element={estaAutenticado && localStorage.getItem("userRole") === "cliente" ? <ClienteDashboard /> : <Navigate to="/Login" />}
          />

          {/* RUTA PROTEGIDA: ADMINISTRADOR */}
          <Route
            path="/admin"
            element={estaAutenticado && localStorage.getItem("userRole") === "admin" ? <AdminLayout /> : <Navigate to="/Login" />}
          >
            <Route index element={<Dashboard />} />
            <Route path="configuracion" element={<Configuracion />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />
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