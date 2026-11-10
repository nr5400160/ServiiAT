import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./login.css";

const Login = ({ setEstaAutenticado, setRol }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const resp = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await resp.json();

      if (!resp.ok) {
        setError(data.mensaje || "Credenciales incorrectas.");
        return;
      }

      // Guardado estandarizado en LocalStorage
      sessionStorage.setItem("user", JSON.stringify({ id: data.id, nombre: data.nombre, rol: data.rol }));
      sessionStorage.setItem("token", data.token || data.id);
      sessionStorage.setItem("rol", data.rol);
      
      // 👉 ESTA ES LA LÍNEA CLAVE QUE HACE FUNCIONAR EL HISTORIAL DEL CLIENTE
      sessionStorage.setItem("id_usuario", data.id);

      setEstaAutenticado(true);
      if (setRol) setRol(data.rol);

      // Redirección dinámica y corregida
      if (data.rol === 'administrador') {
        navigate('/admin');
      } else if (data.rol === 'tecnico') {
        navigate('/tecnico'); 
      } else {
        navigate('/'); 
      }

    } catch (err) {
      console.error('Error:', err.message);
      setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1050 }}>
      <div className="ventana-login">
        <button className="btn-cerrar" onClick={() => navigate('/')}>✕</button>
        <h2>Iniciar Sesión</h2>
        
        {error && <p style={{ color: 'red', backgroundColor: '#fee2e2', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>{error}</p>}

        <form className="formulario-datos" onSubmit={handleLogin}>
          <label>Correo Electrónico *</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          
          <label>Contraseña *</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <button type="submit" className="btn-enviar-login" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar al Sistema'}
          </button>
        </form>
        <p className="footer-link" onClick={() => navigate('/registro')} style={{ marginTop: '15px', cursor: 'pointer' }}>
          ¿No tienes cuenta? <span style={{ color: '#E57373', fontWeight: 'bold' }}>Regístrate aquí</span>
        </p>
      </div>
    </div>
  );
};

export default Login;