import { useOutletContext } from "react-router-dom";
import HistorialVersiones from '../components/historialVersiones';
import Cards from '../components/Cards';
import Tabla from '../components/Tabla';

function AdminDashboard() {
  const { solicitudes, setSolicitudes, cargando } = useOutletContext();

  return (
    <div className="container mt-4">

      <div className="bg-primary text-white p-3 rounded mb-3">
        <h4 className="mb-0">Panel Administrador</h4>
      </div>

      <p className="text-muted">
        Aquí puedes gestionar las solicitudes del sistema.
      </p>

      <Cards reservas={solicitudes} />

      {cargando ? (
        <p>Cargando solicitudes...</p>
      ) : (
        <Tabla reservas={solicitudes} setReservas={setSolicitudes} />
      )}

      <HistorialVersiones />

    </div>
  );
}

export default AdminDashboard;