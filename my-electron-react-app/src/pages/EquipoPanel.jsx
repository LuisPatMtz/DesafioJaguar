import React from 'react';
import { useParams } from 'react-router-dom';

function EquipoPanel() {
  const { id } = useParams(); // obtiene el id de la URL

  return (
    <div>
      <h2>Bienvenido equipo: {id}</h2>
      <p>Este es tu panel de participante en el Desafío Jaguar 🐆</p>
    </div>
  );
}

export default EquipoPanel;
