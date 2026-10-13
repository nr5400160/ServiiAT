import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cliente } from '../supabase/cliente';
import bcrypt from 'bcryptjs';
import "./login.css";

// Cambia esto según lo que quieras usar
// "server" = Local con Workbench
// "cliente" = Supabase
const MODO = "server";

const Login = ({ setEstaAutenticado }) => {

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

      // ─────────────────────────────────────────────
      // LOGIN SERVER LOCAL
      // ─────────────────────────────────────────────
      if (MODO === "server") {

        const resp = await fetch("http://localhost:3001/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        });

        const data = await resp.json();

        if (!resp.ok) {
          setError(data.mensaje || "Credenciales incorrectas.");
          return;
        }

        localStorage.setItem("user", JSON.stringify({
          id: data.id,
          nombre: data.nombre,
          rol: data.rol,
        }));

        localStorage.setItem("token", data.id);
        localStorage.setItem("userRole", data.rol);

        setEstaAutenticado(true);

        if (data.rol === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }

      } else {

        // ─────────────────────────────────────────────
        // LOGIN SUPABASE
        // ─────────────────────────────────────────────

        const { data: correoData, error: correoError } = await cliente
          .from('correo_electronico')
          .select('id_usuario')
          .eq('direccion_email', email)
          .single();

        if (correoError || !correoData) {
          setError("Correo no registrado.");
          return;
        }

        const { data: userData, error: userError } = await cliente
          .from('usuario')
          .select('id_usuario, nombre_1, id_roles, clave')
          .eq('id_usuario', correoData.id_usuario)
          .single();

        if (userError || !userData) {
          setError("Error al obtener usuario.");
          return;
        }

        // VALIDAR CONTRASEÑA
        const claveValida = await bcrypt.compare(password, userData.clave);

        if (!claveValida) {
          setError("Contraseña incorrecta.");
          return;
        }

        // MAPA DE ROLES
        const rolesMap = {
          3: 'admin',
          2: 'tecnico',
          1: 'cliente'
        };

        const rolTexto = rolesMap[userData.id_roles] || 'cliente';

        // GUARDAR SESIÓN
        localStorage.setItem("user", JSON.stringify({
          id: userData.id_usuario,
          nombre: userData.nombre_1,
          rol: rolTexto,
        }));

        localStorage.setItem("token", userData.id_usuario);
        localStorage.setItem("userRole", rolTexto);

        setEstaAutenticado(true);

        if (rolTexto === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }

    } catch (err) {

      console.error('Error en login:', err.message);
      setError("Error inesperado. Intenta de nuevo.");

    } finally {

      setLoading(false);

    }
  };

  return (

    <div
      className="modal-overlay"
      style={{ zIndex: 1050 }}
    >

      <div className="ventana-login">

        {/* BOTÓN CERRAR */}
        <button
          className="btn-cerrar"
          onClick={() => navigate('/')}
        >
          ✕
        </button>

        <h2>Iniciar Sesión</h2>

        <p className="sub-login">
          Ingresa a tu panel de AR Servicio Técnico
        </p>

        {/* MENSAJE ERROR */}
        {error && (

          <p
            className="error"
            style={{
              color: 'red',
              backgroundColor: '#fee2e2',
              padding: '10px',
              borderRadius: '5px',
              textAlign: 'center'
            }}
          >
            {error}
          </p>

        )}

        {/* FORMULARIO */}
        <form
          className="formulario-datos"
          onSubmit={handleLogin}
        >

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

          {/* BOTÓN LOGIN */}
          <button
            type="submit"
            className="btn-enviar-login"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar al Sistema'}
          </button>

        </form>

        {/* IR A REGISTRO */}
        <p
          className="footer-link"
          onClick={() => navigate('/registro')}
          style={{
            marginTop: '15px',
            cursor: 'pointer'
          }}
        >
          ¿No tienes cuenta?
          <span
            style={{
              color: '#E57373',
              fontWeight: 'bold'
            }}
          >
            {" "}Regístrate aquí
          </span>
        </p>

      </div>

    </div>
  );
};

export default Login;