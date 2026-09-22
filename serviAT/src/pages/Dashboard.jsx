import { useEffect, useState } from "react";
import Cards from "../components/Cards";
import Tabla from "../components/Tabla";

function Dashboard() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  const URL = "https://69d82a490576c93882592a63.mockapi.io/Formulrio";

  useEffect(() => {
    obtenerReservas();
  }, []);

  const obtenerReservas = async () => {
    try {
      const res = await fetch(URL);
      const data = await res.json();

      console.log("DATA API", data);

      setReservas(data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Cargando datos...</p>;

  return (
    <div>
      <h2>Dashboard</h2>
      <p className="subtitulo">Panel de Administración</p>

      <Cards reservas={reservas} />
      <Tabla reservas={reservas} setReservas={setReservas} />
    </div>
  );
}

export default Dashboard;