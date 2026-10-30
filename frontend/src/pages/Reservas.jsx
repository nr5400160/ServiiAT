import { useEffect, useState } from "react";
import Tabla from "../components/Tabla";

function Reservas() {

  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    fetch("https://69d036dc90cd06523d5d20c0.mockapi.io/reservar")
      .then(res => res.json())
      .then(data => setReservas(data));
  }, []);

  return (
    <div>
      <Tabla reservas={reservas} setReservas={setReservas} />
    </div>
  );
}

export default Reservas;