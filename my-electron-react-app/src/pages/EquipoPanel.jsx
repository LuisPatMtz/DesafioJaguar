import React from 'react';
import { useParams } from 'react-router-dom';
import { CronometroContext } from '../components/cronometro/CronometroContext';


function EquipoPanel() {
  const { detenerCronometro} = React.useContext(CronometroContext); // obtiene el contexto del cronómetro
  const { id } = useParams(); // obtiene el id de la URL

  const detener  = () =>{
    detenerCronometro(id)
    console.log('deteniedo cronometro')
  };

  return (
    <div>
      <h2>Bienvenido equipo: {id}</h2>
      <button onClick={detener}>pausa</button>
      <p>Este es tu panel de participante en el Desafío Jaguar 🐆</p>
    </div>
  );
}

export default EquipoPanel;
