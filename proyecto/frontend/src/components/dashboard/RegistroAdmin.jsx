import React, { useState } from 'react';
import "../../pages/registro.css";

const RegistroAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const [formData, setFormData] = useState({
    nombre_1: "",
    nombre_2: "",
    apellido_1: "",
    apellido_2: "",
    tipo_documento: "CC",
    documento: "",
    fecha_nacimiento: "",
    email: "",
    telefono: "",
    direccion: "",
    rol: "2" // Por defecto: 2 (Técnico)
  });

  const handleChange = (campo) => (e) =>
    setFormData({ ...formData, [campo]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    try {
      const payload = {
        nombre_1: formData.nombre_1,
        nombre_2: formData.nombre_2,
        apellido_1: formData.apellido_1,
        apellido_2: formData.apellido_2,
        tipo_documento: formData.tipo_documento,
        documento: formData.documento,
        fecha_nacimiento: formData.fecha_nacimiento,
        email: formData.email,
        numero_tel: formData.telefono,
        direccion_comp: formData.direccion,
        rol: formData.rol
      };

      // Apunta al nuevo endpoint protegido que creaste en el backend
      const resp = await fetch("http://localhost:3001/api/admin/crear-usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await resp.json();

      if (resp.ok) {
        setMensaje("✅ Personal registrado y credenciales enviadas por correo.");
        // Limpiar el formulario tras el éxito
        setFormData({
          nombre_1: "", nombre_2: "", apellido_1: "", apellido_2: "",
          tipo_documento: "CC", documento: "", fecha_nacimiento: "",
          email: "", telefono: "", direccion: "", rol: "2"
        });
      } else {
        alert("Error: " + (data.detalle || data.error || "Revisa los datos"));
      }

    } catch (err) {
      console.error('❌ Error registrando personal:', err.message);
      alert('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: '#0d47a1', borderBottom: '2px solid #0d47a1', paddingBottom: '10px' }}>
        Registrar Nuevo Personal
      </h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        El sistema generará una contraseña segura automáticamente y se la enviará al empleado por correo electrónico.
      </p>

      {mensaje && (
        <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
          {mensaje}
        </div>
      )}

      <form className="formulario-datos" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} onSubmit={handleSubmit}>
        
        <div className="flex-row">
          <input className="input-field" type="text" placeholder="Primer Nombre*" required value={formData.nombre_1} onChange={handleChange('nombre_1')} />
          <input className="input-field" type="text" placeholder="Segundo Nombre" value={formData.nombre_2} onChange={handleChange('nombre_2')} />
        </div>

        <div className="flex-row">
          <input className="input-field" type="text" placeholder="Primer Apellido*" required value={formData.apellido_1} onChange={handleChange('apellido_1')} />
          <input className="input-field" type="text" placeholder="Segundo Apellido" value={formData.apellido_2} onChange={handleChange('apellido_2')} />
        </div>

        <div className="flex-row">
          <select className="input-field select-custom" value={formData.tipo_documento} onChange={handleChange('tipo_documento')}>
            <option value="CC">C.C.</option>
            <option value="TI">T.I.</option>
            <option value="CE">C.E.</option>
          </select>
          <input className="input-field" type="text" placeholder="Número Documento*" required value={formData.documento} onChange={handleChange('documento')} />
        </div>

        <div className="flex-row">
          {/* AQUÍ ESTÁ EL SELECTOR DE ROL RESTRINGIDO */}
          <select 
            className="input-field select-custom" 
            style={{ backgroundColor: '#e3f2fd', fontWeight: 'bold', borderColor: '#1976d2' }}
            value={formData.rol} 
            onChange={handleChange('rol')}
          >
            <option value="2">Rol: Técnico</option>
            <option value="3">Rol: Administrador</option>
          </select>

          <input className="input-field" type="text" placeholder="Teléfono" required value={formData.telefono} onChange={handleChange('telefono')} />
        </div>

        <div className="flex-row">
          <div style={{ width: '100%', textAlign: 'left' }}>
            <label style={{ fontSize: '11px', color: '#666', marginLeft: '5px' }}>Fecha Nacimiento*</label>
            <input className="input-field" type="date" required value={formData.fecha_nacimiento} onChange={handleChange('fecha_nacimiento')} />
          </div>
          <input className="input-field" style={{ alignSelf: 'flex-end' }} type="text" placeholder="Dirección" required value={formData.direccion} onChange={handleChange('direccion')} />
        </div>

        {/* CAMPO DE CORREO (NO HAY CONTRASEÑA) */}
        <input className="input-field" type="email" placeholder="Correo Electrónico (Para enviar credenciales)*" required value={formData.email} onChange={handleChange('email')} />

        <button type="submit" className="btn-enviar-registro" style={{ width: '100%', marginTop: '20px' }} disabled={loading}>
          {loading ? 'Generando y Registrando...' : 'Registrar Empleado'}
        </button>

      </form>
    </div>
  );
};

export default RegistroAdmin;