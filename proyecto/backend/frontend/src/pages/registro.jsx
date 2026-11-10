import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./registro.css";

const Registro = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 1. Estado inicial limpio (Sin 'rol')
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
    direccion: ""
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
      // 2. Mapeo exacto para el Backend (Sin enviar 'rol')
      const payload = {
        nombre_1: formData.nombre_1,
        nombre_2: formData.nombre_2,
        apellido_1: formData.apellido_1,
        apellido_2: formData.apellido_2,
        tipo_documento: formData.tipo_documento,
        documento: formData.documento,
        clave: formData.clave,
        fecha_nacimiento: formData.fecha_nacimiento,
        email: formData.email,
        numero_tel: formData.telefono,
        direccion_comp: formData.direccion
      };

      const resp = await fetch("http://localhost:3001/api/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await resp.json();

      if (resp.ok) {
        alert("¡Registro Exitoso!");
        navigate('/login');
      } else {
        alert("Error: " + (data.detalle || data.error || "Revisa los datos"));
      }

    } catch (err) {
      console.error('❌ Error en registro:', err.message);
      alert('Error al conectar con el servidor: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <form className="ventana-registro-grande" onSubmit={handleSubmit}>

        <button
          type="button"
          className="btn-cerrar"
          onClick={() => navigate('/')}
        >
          ✕
        </button>

        <h2>Crear Cuenta en ServiAT</h2>

        <div className="flex-row">
          <input
            className="input-field"
            type="text"
            placeholder="Primer Nombre*"
            required
            value={formData.nombre_1}
            onChange={handleChange('nombre_1')}
          />
          <input
            className="input-field"
            type="text"
            placeholder="Segundo Nombre"
            value={formData.nombre_2}
            onChange={handleChange('nombre_2')}
          />
        </div>

        <div className="flex-row">
          <input
            className="input-field"
            type="text"
            placeholder="Primer Apellido*"
            required
            value={formData.apellido_1}
            onChange={handleChange('apellido_1')}
          />
          <input
            className="input-field"
            type="text"
            placeholder="Segundo Apellido"
            value={formData.apellido_2}
            onChange={handleChange('apellido_2')}
          />
        </div>

        {/* TIPO DE DOCUMENTO Y NÚMERO DE DOCUMENTO (Ahora en la misma fila) */}
        <div className="flex-row">
          <select
            className="input-field select-custom"
            value={formData.tipo_documento}
            onChange={handleChange('tipo_documento')}
          >
            <option value="CC">C.C.</option>
      
          </select>

          <input
            className="input-field"
            type="text"
            placeholder="Número Documento*"
            required
            value={formData.documento}
            onChange={handleChange('documento')}
          />
        </div>

        {/* TELÉFONO SOLITARIO A LO ANCHO */}
        <div className="flex-row">
          <input
            className="input-field"
            style={{ width: '100%' }}
            type="text"
            placeholder="Teléfono"
            value={formData.telefono}
            onChange={handleChange('telefono')}
          />
        </div>

        <div className="flex-row">
          <div style={{ width: '100%', textAlign: 'left' }}>
            <label style={{ fontSize: '11px', color: '#666', marginLeft: '5px' }}>
              Fecha Nacimiento*
            </label>
            <input
              className="input-field"
              type="date"
              required
              value={formData.fecha_nacimiento}
              onChange={handleChange('fecha_nacimiento')}
            />
          </div>
          <input
            className="input-field"
            style={{ alignSelf: 'flex-end' }}
            type="text"
            placeholder="Dirección"
            value={formData.direccion}
            onChange={handleChange('direccion')}
          />
        </div>

        <input
          className="input-field"
          type="email"
          placeholder="Correo Electrónico*"
          required
          value={formData.email}
          onChange={handleChange('email')}
        />

        <input
          className="input-field"
          type="password"
          placeholder="Contraseña (mín. 8)*"
          required
          value={formData.clave}
          onChange={handleChange('clave')}
        />

        <button
          type="submit"
          className="btn-enviar-registro"
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>

        <p className="footer-link" onClick={() => navigate('/login')}>
          ¿Ya tienes cuenta? Inicia sesión
        </p>

      </form>
    </div>
  );
};

export default Registro;