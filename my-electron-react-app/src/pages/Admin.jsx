import React from "react";
import CronometroAdmin from "../components/cronometro/CronometroAdmin";

function Admin() {
  return (
    <div style={{ color: "white" }}>
        <CronometroAdmin />
      <h1>Bienvenido Administrador</h1>
      <p>Esta es la pagina de administracion</p>
      
    </div>
  );
}

export default Admin;