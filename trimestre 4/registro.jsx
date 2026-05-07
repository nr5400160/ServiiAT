import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./registro.css";

const Registro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    rol: "cliente"
  });
  
  const [error, setError] = useState("");
  const [exito, setExito] = useState(""); 

  const handleRegister = (e) => {
    e.preventDefault();
    const { email, password, confirmPassword, rol } = formData;

    setError(""); 

    if (!email || !password || !confirmPassword) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios_db")) || [];
    
    if (usuariosGuardados.find(u => u.email === email)) {
      setError("Este correo ya está registrado");
      return;
    }

    const nuevoUsuario = { email, password, rol };
    usuariosGuardados.push(nuevoUsuario);
    localStorage.setItem("usuarios_db", JSON.stringify(usuariosGuardados));


    setExito("¡Registro exitoso! Redirigiendo al login...");

    
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="ventana-registro">
        <button className="btn-cerrar" onClick={() => navigate('/')}>×</button>
        <h2>Crear Cuenta</h2>
        <p className="sub-login">Regístrate en AR Servicio Técnico</p>

       
        {error && <p className="error" style={{ color: 'red', backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>{error}</p>}
        
        
        {exito && <p className="exito" style={{ color: '#155724', backgroundColor: '#d4edda', padding: '10px', borderRadius: '5px', textAlign: 'center', border: '1px solid #c3e6cb' }}>{exito}</p>}

        <form className="formulario-datos" onSubmit={handleRegister}>
          <label>Correo Electrónico *</label>
          <input 
            type="email" 
            placeholder="correo@ejemplo.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          
          <label>Contraseña *</label>
          <input 
            type="password" 
            placeholder="Crea una contraseña"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />

          <label>Confirmar Contraseña *</label>
          <input 
            type="password" 
            placeholder="Repite la contraseña"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
          />

          <label>Tipo de cuenta *</label>
          <select
            value={formData.rol}
            onChange={(e) => setFormData({...formData, rol: e.target.value})}
            style={{
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid #d1d5db',
              outline: 'none',
              fontSize: '14px',
              backgroundColor: 'white'
            }}
          >
            <option value="cliente">Cliente</option>
            <option value="admin">Administrador</option>
          </select>
          
          <button type="submit" className="btn-enviar-registro" disabled={exito !== ""}>
            {exito ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <p className="footer-link" onClick={() => navigate('/login')} style={{ cursor: 'pointer', marginTop: '15px' }}>
          ¿Ya tienes cuenta? <span style={{ color: '#E57373', fontWeight: 'bold' }}>Inicia sesión aquí</span>
        </p>
      </div>
    </div>
  );
};

export default Registro;