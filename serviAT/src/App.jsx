import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from 'react';

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
import ClienteDashboard from "./pages/ClienteDashboard";
import Configuracion from "./pages/Configuracion";
import AdminLayout from "./components/dashboard/AdminLayout";
import Stepper from "./components/steppers";
import Dashboard from "./pages/Dashboard";

import Pago from "./components/Pago";


import './App.css';
import "./index.css";

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
          <Route path="/" element={<Index />} />
          <Route path="/index" element={<Index />} />
          <Route path="/ServiciosNav" element={<ServiciosNav />} />
          <Route path="/AcerdaDeNosotros" element={<AcercaDeNosotros />} />
          <Route path="/Login" element={<Login setEstaAutenticado={setEstaAutenticado} />} />
          <Route path="/Registro" element={<Registro />} />
          <Route path="/Pago" element={<Pago />} />
          <Route path="/infoUsuario" element={estaAutenticado ? <InformacionPaso1 /> : <Navigate to="/Registro" />} />
          <Route path="/Formulario" element={estaAutenticado ? <Formulario /> : <Navigate to="/Registro" />} />
          <Route path="/ValidarInformacion" element={estaAutenticado ? <ValidarInformacion /> : <Navigate to="/Registro" />} />
          <Route path="/ServicioConfirmado" element={estaAutenticado ? <ServicioConfirmado /> : <Navigate to="/Registro" />} />
          <Route path="/ClienteHistorial" element={estaAutenticado && localStorage.getItem("userRole") === "cliente" ? <ClienteDashboard /> : <Navigate to="/Login" />} />
          <Route path="/admin" element={estaAutenticado && localStorage.getItem("userRole") === "admin" ? <AdminLayout /> : <Navigate to="/Login" />} >
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