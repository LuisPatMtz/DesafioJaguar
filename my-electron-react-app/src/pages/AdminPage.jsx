import React from 'react';
import CronometroAdmin from "../components/cronometro/CronometroAdmin";

function AdminPage() {
  return (
    <div>
      <h2>Bienvenido al Panel de Administrador</h2>
      <p>Aquí podrás gestionar el desafío.</p>
      <CronometroAdmin />
    </div>
  );
}

export default AdminPage;
