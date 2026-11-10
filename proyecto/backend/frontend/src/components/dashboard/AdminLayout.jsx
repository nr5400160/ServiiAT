import React from "react";
import { Outlet } from "react-router-dom";
import MenuLateral from "./MenuLateral"; 

const AdminLayout = () => {
  return (
    <div className="app" style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f4f6f9" }}>
      {/* El menú azul siempre fijo a la izquierda */}
      <MenuLateral />

      {/* Aquí es donde React inyectará dinámicamente la vista de Registro o de Solicitudes */}
      <div className="contenido" style={{ flex: 1, padding: "30px", overflowY: "auto" }}>
        <Outlet /> 
      </div>
    </div>
  );
};

export default AdminLayout;