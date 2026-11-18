import React, { useState } from 'react';
import "../../pages/registro.css";
import "../../pages/AdminRegistro.css";

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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`
        },
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
    <section className="registro-personal">
      <header className="registro-personal__encabezado">
        <span className="registro-personal__icono">
          <i className="bi bi-person-plus-fill" aria-hidden="true"></i>
        </span>
        <div>
          <span className="registro-personal__eyebrow">GESTIÓN DE PERSONAL</span>
          <h1>Registrar nuevo empleado</h1>
          <p>Completa la información para crear una cuenta de trabajo.</p>
        </div>
      </header>

      {mensaje && (
        <div className="registro-personal__mensaje" role="status">
          <i className="bi bi-check-circle-fill" aria-hidden="true"></i>
          {mensaje}
        </div>
      )}

      <form className="registro-personal__formulario" onSubmit={handleSubmit}>
        <section className="registro-personal__seccion" aria-labelledby="registro-datos-personales">
          <div className="registro-personal__seccion-titulo">
            <span className="registro-personal__seccion-icono">
              <i className="bi bi-person-vcard" aria-hidden="true"></i>
            </span>
            <div>
              <h2 id="registro-datos-personales">Datos personales</h2>
              <p>Información de identificación del empleado.</p>
            </div>
          </div>
          <div className="registro-personal__campos">
            <label className="registro-personal__campo">
              <span>Primer nombre <b>*</b></span>
              <input className="input-field" type="text" autoComplete="given-name" required value={formData.nombre_1} onChange={handleChange('nombre_1')} />
            </label>
            <label className="registro-personal__campo">
              <span>Segundo nombre</span>
              <input className="input-field" type="text" autoComplete="additional-name" value={formData.nombre_2} onChange={handleChange('nombre_2')} />
            </label>
            <label className="registro-personal__campo">
              <span>Primer apellido <b>*</b></span>
              <input className="input-field" type="text" autoComplete="family-name" required value={formData.apellido_1} onChange={handleChange('apellido_1')} />
            </label>
            <label className="registro-personal__campo">
              <span>Segundo apellido</span>
              <input className="input-field" type="text" value={formData.apellido_2} onChange={handleChange('apellido_2')} />
            </label>
            <label className="registro-personal__campo">
              <span>Tipo de documento</span>
              <select className="input-field select-custom" value={formData.tipo_documento} onChange={handleChange('tipo_documento')}>
                <option value="CC">Cédula de ciudadanía</option>
                <option value="TI">Tarjeta de identidad</option>
                <option value="CE">Cédula de extranjería</option>
              </select>
            </label>
            <label className="registro-personal__campo">
              <span>Número de documento <b>*</b></span>
              <input className="input-field" type="text" autoComplete="off" required value={formData.documento} onChange={handleChange('documento')} />
            </label>
            <label className="registro-personal__campo">
              <span>Fecha de nacimiento <b>*</b></span>
              <input className="input-field" type="date" autoComplete="bday" required value={formData.fecha_nacimiento} onChange={handleChange('fecha_nacimiento')} />
            </label>
          </div>
        </section>

        <section className="registro-personal__seccion" aria-labelledby="registro-datos-contacto">
          <div className="registro-personal__seccion-titulo">
            <span className="registro-personal__seccion-icono">
              <i className="bi bi-envelope-paper" aria-hidden="true"></i>
            </span>
            <div>
              <h2 id="registro-datos-contacto">Datos de contacto</h2>
              <p>Usaremos estos datos para comunicarnos con el empleado.</p>
            </div>
          </div>
          <div className="registro-personal__campos">
            <label className="registro-personal__campo">
              <span>Correo electrónico <b>*</b></span>
              <input className="input-field" type="email" autoComplete="email" required value={formData.email} onChange={handleChange('email')} />
            </label>
            <label className="registro-personal__campo">
              <span>Teléfono <b>*</b></span>
              <input className="input-field" type="tel" autoComplete="tel" required value={formData.telefono} onChange={handleChange('telefono')} />
            </label>
            <label className="registro-personal__campo registro-personal__campo--completo">
              <span>Dirección <b>*</b></span>
              <input className="input-field" type="text" autoComplete="street-address" required value={formData.direccion} onChange={handleChange('direccion')} />
            </label>
          </div>
        </section>

        <section className="registro-personal__seccion registro-personal__seccion--acceso" aria-labelledby="registro-acceso">
          <div className="registro-personal__seccion-titulo">
            <span className="registro-personal__seccion-icono">
              <i className="bi bi-shield-check" aria-hidden="true"></i>
            </span>
            <div>
              <h2 id="registro-acceso">Acceso al sistema</h2>
              <p>Define el perfil que tendrá dentro de la plataforma.</p>
            </div>
          </div>
          <label className="registro-personal__campo">
            <span>Rol del empleado <b>*</b></span>
            <select className="input-field select-custom" value={formData.rol} onChange={handleChange('rol')}>
              <option value="2">Técnico</option>
              <option value="3">Administrador</option>
            </select>
          </label>
          <div className="registro-personal__nota">
            <i className="bi bi-info-circle-fill" aria-hidden="true"></i>
            <p>Generaremos una contraseña segura y enviaremos las credenciales al correo indicado.</p>
          </div>
        </section>

        <footer className="registro-personal__pie">
          <span><b>*</b> Campos obligatorios</span>
          <button type="submit" className="registro-personal__enviar" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                Registrando empleado...
              </>
            ) : (
              <>
                <i className="bi bi-person-check-fill" aria-hidden="true"></i>
                Registrar empleado
              </>
            )}
          </button>
        </footer>
      </form>
    </section>
  );
};

export default RegistroAdmin;