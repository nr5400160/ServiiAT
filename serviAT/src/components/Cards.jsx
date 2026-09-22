function Cards({ reservas }) {
  const pendientes = reservas.filter(r => r.estado === "Pendiente").length;
  const completadas = reservas.filter(r => r.estado === "Completadas").length;
  const enProceso = reservas.filter(r => r.estado === "En Proceso").length;
  const canceladas = reservas.filter(r => r.estado === "Cancelado").length;
  const servicios = reservas.filter(r => r.estado === "Servicios").length;

  return (
    <div className="contenedor-cards">

      <div className="card azul">
        <h3>{reservas.length}</h3>
        <p>Total Reservas</p>
      </div>

      <div className="card amarillo">
        <h3>{pendientes}</h3>
        <p>Pendientes</p>
      </div>

      <div className="card celeste">
        <h3>{enProceso}</h3>
        <p>En Proceso</p>
      </div>

      <div className="card verde">
        <h3>{completadas}</h3>
        <p>Completadas</p>
      </div>

      <div className="card rojo">
        <h3>{canceladas}</h3>
        <p>Canceladas</p>
      </div>

      <div className="card morado">
        <h3>{servicios}</h3>
        <p>Servicios</p>
      </div>

    </div>
  );
}

export default Cards;