import { useState, useEffect } from "react";

function Configuracion() {
  const [data, setData] = useState({
    nombre: "Fabio Alexander Rojas Lara",
    telefono: "3005635595",
    especialidades: "Neveras, Lavadoras, Estufas, Microondas, Equipos HORECA",
    descripcion: "Técnico especializado con más de 10 años de experiencia en reparación de electrodomésticos industriales y domésticos.",
    horario: "Lunes a Sábado: 8:00 AM - 6:00 PM",
    titulo: "Reparación Profesional de Electrodomésticos",
    subtitulo: "Servicio técnico especializado en reparación de electrodomésticos industriales."
  });

  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const guardado = localStorage.getItem("config");
    if (guardado) {
      setData(JSON.parse(guardado));
    }
  }, []);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  const guardarConfig = () => {
    localStorage.setItem("config", JSON.stringify(data));

    setMensaje("Configuración guardada correctamente");

    setTimeout(() => {
      setMensaje("");
    }, 3000);
  };

  return (
    <div>
      <h2 className="titulo-config">Configuración</h2>

      {mensaje && <p className="mensaje-exito">{mensaje}</p>}

      <div className="config-cards">
        <div className="config-card">
          <h4><i className="bi bi-file-earmark-person-fill"></i> Información del Técnico</h4>

          <label><i className="bi bi-person-bounding-box"></i> Nombre completo</label>
          <input name="nombre" value={data.nombre} onChange={handleChange} />

          <label><i className="bi bi-telephone-forward-fill"></i> Teléfono / WhatsApp</label>
          <input name="telefono" value={data.telefono} onChange={handleChange} />

          <label><i className="bi bi-gear-fill"></i> Especialidades</label>
          <input name="especialidades" value={data.especialidades} onChange={handleChange} />

          <h4><i className="bi bi-file-person"></i> Sobre el técnico</h4>
          <textarea name="descripcion" value={data.descripcion} onChange={handleChange} />

          <h4>Horario de atención</h4>
          <input name="horario" value={data.horario} onChange={handleChange} />
        </div><br />

        <div className="config-card">
          <h4>Información General</h4>

          <label>Cargo</label>
          <input name="titulo" value={data.titulo} onChange={handleChange} />

          <label>Descripción Cargo</label>
          <textarea name="subtitulo" value={data.subtitulo} onChange={handleChange} />
        </div>
      </div>

      <button className="btn-guardar" onClick={guardarConfig}>
        Guardar Configuración
      </button>
    </div>
  );
}

export default Configuracion;