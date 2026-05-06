import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./login.css";

const Login = ({ setEstaAutenticado }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    
    setError("");

    if (!email || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    
    const registrados = JSON.parse(localStorage.getItem("usuarios_db")) || [];

    const user = registrados.find(u => u.email === email && u.password === password);

    if (!user) {
      setError("Correo o contraseña incorrectos");
      return;
    }

    localStorage.setItem("userRole", user.rol);
    localStorage.setItem("token", btoa(user.email + ":" + user.rol));
    localStorage.setItem("userEmail", user.email);


    setEstaAutenticado(true);

    if (user.rol === "admin") {
      navigate("/admin");
    } else {
      navigate("/ClienteHistorial");
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1050 }}>
      <div className="ventana-login">
        <button className="btn-cerrar" onClick={() => navigate('/')}>×</button>
        
        <h2>Iniciar Sesión</h2>
        <p className="sub-login">Ingresa a tu panel de AR Servicio Técnico</p>

        {error && (
          <p className="error" style={{
            color: 'red', 
            backgroundColor: '#fee2e2', 
            padding: '10px', 
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            {error}
          </p>
        )}

        <form className="formulario-datos" onSubmit={handleLogin}>
          <label>Correo Electrónico *</label>
          <input 
            type="email" 
            placeholder="ejemplo@correo.com"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          
          <label>Contraseña *</label>
          <input 
            type="password" 
            placeholder="Tu contraseña"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          
          <button type="submit" className="btn-enviar-login">
            Ingresar al Sistema
          </button>
        </form>

        <p className="footer-link" onClick={() => navigate('/registro')} style={{marginTop: '15px', cursor: 'pointer'}}>
          ¿No tienes cuenta? <span style={{color: '#E57373', fontWeight: 'bold'}}>Regístrate aquí</span>
        </p>
      </div>
    </div>
  );
};

export default Login;