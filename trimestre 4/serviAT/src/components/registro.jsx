import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cliente } from '../supabase/cliente';
import bcrypt from 'bcryptjs';
import "./registro.css";

//  Cambia esto según lo que quieras usar
const MODO = "server"; // "server" = WorkBench | "cliente" = Supabase

const Registro = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre_1: "",
    nombre_2: "",
    apellido_1: "",
    apellido_2: "",
    tipo_documento: "CC",
    documento: "",
    clave: "",
    fecha_nacimiento: "",
    email: "",
    telefono: "",
    direccion: "",
    rol: "1"
  });

  const handleChange = (campo) => (e) =>
    setFormData({
      ...formData,
      [campo]: e.target.value
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.clave.length < 8) {
      alert("La clave debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);

    try {

      // ─────────────────────────────────────────────
      // MODO SERVER (Workbench / MySQL)
      // ─────────────────────────────────────────────
      if (MODO === "server") {

        const resp = await fetch("http://localhost:3001/api/registro", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ...formData,
            numero_tel: formData.telefono,
            direccion_comp: formData.direccion
          })
        });

        const data = await resp.json();

        if (resp.ok) {
          alert("¡Registro Exitoso!");
          navigate('/login');
        } else {
          alert("Error: " + (data.error || "Revisa los datos"));
        }

      } else {

        // ─────────────────────────────────────────────
        // MODO SUPABASE
        // ─────────────────────────────────────────────

        const claveEncriptada = await bcrypt.hash(formData.clave, 10);

        const { data: userRes, error: userError } = await cliente
          .from('usuario')
          .insert([{
            nombre_1: formData.nombre_1,
            nombre_2: formData.nombre_2,
            apellido_1: formData.apellido_1,
            apellido_2: formData.apellido_2,
            tipo_documento: formData.tipo_documento,
            documento: formData.documento,
            clave: claveEncriptada,
            fecha_nacimiento: formData.fecha_nacimiento,
            id_roles: parseInt(formData.rol) || 1,
          }])
          .select();

        if (userError) throw userError;

        const nuevoId = userRes[0].id_usuario;

        const [correoRes, telRes, dirRes] = await Promise.all([

          cliente
            .from('correo_electronico')
            .insert([{
              direccion_email: formData.email,
              tipo: 'Personal',
              id_usuario: nuevoId
            }]),

          cliente
            .from('telefono')
            .insert([{
              numero: formData.telefono,
              tipo: 'Celular',
              id_usuario: nuevoId
            }]),

          cliente
            .from('direccion')
            .insert([{
              direccion_completa: formData.direccion,
              usuario_id_usuario: nuevoId
            }])

        ]);

        if (correoRes.error) throw correoRes.error;
        if (telRes.error) throw telRes.error;
        if (dirRes.error) throw dirRes.error;

        alert('¡Registro Exitoso!');
        navigate('/login');
      }

    } catch (err) {

      console.error('❌ Error en registro:', err.message);
      alert('Error al registrar: ' + err.message);

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="modal-overlay">

      <form className="ventana-registro-grande" onSubmit={handleSubmit}>

        {/* BOTÓN X */}
        <button
          type="button"
          className="btn-cerrar"
          onClick={() => navigate('/')}
        >
          ✕
        </button>

        <h2>Crear Cuenta en ServiAT</h2>

        {/* NOMBRES */}
        <div className="flex-row">

          <input
            className="input-field"
            type="text"
            placeholder="Primer Nombre*"
            required
            onChange={handleChange('nombre_1')}
          />

          <input
            className="input-field"
            type="text"
            placeholder="Segundo Nombre"
            onChange={handleChange('nombre_2')}
          />

        </div>

        {/* APELLIDOS */}
        <div className="flex-row">

          <input
            className="input-field"
            type="text"
            placeholder="Primer Apellido*"
            required
            onChange={handleChange('apellido_1')}
          />

          <input
            className="input-field"
            type="text"
            placeholder="Segundo Apellido"
            onChange={handleChange('apellido_2')}
          />

        </div>

        {/* DOCUMENTO Y ROL */}
        <div className="flex-row">

          <select
            className="input-field select-custom"
            value={formData.tipo_documento}
            onChange={handleChange('tipo_documento')}
          >
            <option value="CC">C.C.</option>
            <option value="TI">T.I.</option>
            <option value="CE">C.E.</option>
          </select>

          <select
            className="input-field select-custom"
            style={{
              backgroundColor: '#fff4f4',
              fontWeight: 'bold',
              borderColor: '#E57373'
            }}
            value={formData.rol}
            onChange={handleChange('rol')}
          >
            <option value="1">Soy Cliente</option>
            <option value="2">Soy Técnico</option>
            <option value="3">Soy Administrador</option>
          </select>

        </div>

        {/* DOCUMENTO Y TELÉFONO */}
        <div className="flex-row">

          <input
            className="input-field"
            type="text"
            placeholder="Número Documento*"
            required
            onChange={handleChange('documento')}
          />

          <input
            className="input-field"
            type="text"
            placeholder="Teléfono"
            onChange={handleChange('telefono')}
          />

        </div>

        {/* FECHA Y DIRECCIÓN */}
        <div className="flex-row">

          <div style={{ width: '100%', textAlign: 'left' }}>

            <label
              style={{
                fontSize: '11px',
                color: '#666',
                marginLeft: '5px'
              }}
            >
              Fecha Nacimiento*
            </label>

            <input
              className="input-field"
              type="date"
              required
              onChange={handleChange('fecha_nacimiento')}
            />

          </div>

          <input
            className="input-field"
            style={{ alignSelf: 'flex-end' }}
            type="text"
            placeholder="Dirección"
            onChange={handleChange('direccion')}
          />

        </div>

        {/* EMAIL */}
        <input
          className="input-field"
          type="email"
          placeholder="Correo Electrónico*"
          required
          onChange={handleChange('email')}
        />

        {/* PASSWORD */}
        <input
          className="input-field"
          type="password"
          placeholder="Contraseña (mín. 8)*"
          required
          onChange={handleChange('clave')}
        />

        {/* BOTÓN */}
        <button
          type="submit"
          className="btn-enviar-registro"
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>

        {/* LOGIN */}
        <p
          className="footer-link"
          onClick={() => navigate('/login')}
        >
          ¿Ya tienes cuenta? Inicia sesión
        </p>

      </form>

    </div>
  );
};

export default Registro;