import { useState } from "react";

function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [icono, setIcono] = useState("bi-tools"); 

  const crearServicio = () => {
    if (!nombre) return alert("Escribe un nombre");

    setServicios([...servicios, { nombre, descripcion, icono }]);

    setNombre("");
    setDescripcion("");
  };

  return (
    <div>
      <h2>Servicios</h2>

     
      <input
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <input
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />

    
      <select value={icono} onChange={(e) => setIcono(e.target.value)}>
        <option value="bi-tools">Herramientas</option>
        <option value="bi-snow">Nevera</option>
        <option value="bi-fire">Estufa</option>
        <option value="bi-lightbulb">Electricidad</option>
        <option value="bi-house">Hogar</option>
      </select>

      <button onClick={crearServicio}>Crear</button>

      {/* TARJETAS */}
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        {servicios.map((s, i) => (
          <div key={i} style={{ border: "1px solid #ccc", padding: "10px" }}>
            <i className={`bi ${s.icono}`} style={{ fontSize: "30px" }}></i>
            <h4>{s.nombre}</h4>
            <p>{s.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Servicios;