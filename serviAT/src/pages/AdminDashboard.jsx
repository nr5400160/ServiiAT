import HistorialVersiones from '../components/historialVersiones';
function AdminDashboard() {
  return (
    <div className="container mt-4">

      <div className="bg-primary text-white p-3 rounded mb-3">
        <h4 className="mb-0">Panel Administrador</h4>
      </div>

      <p className="text-muted">
        Aquí puedes gestionar las solicitudes del sistema.
      </p>

      <HistorialVersiones />

    </div>
  );
}

export default AdminDashboard;
