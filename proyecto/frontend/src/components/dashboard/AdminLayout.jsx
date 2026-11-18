import React from "react";
import { Outlet } from "react-router-dom";
import MenuLateral from "./MenuLateral"; 

const AdminLayout = () => {
  return (
    <div className="app admin-layout">
      <MenuLateral />
      <main className="contenido admin-layout__contenido">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;