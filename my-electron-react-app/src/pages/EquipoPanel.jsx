import React from 'react';
import { useParams } from 'react-router-dom';
import { CronometroContext } from '../components/cronometro/CronometroContext';
import {Cuestionario} from '../components/panelPreguntas/Cuetionario';


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
      <p>Este es tu panel de participante en el Desafío Jaguar 🐆</p>
      <p>Debes responder las preguntas de la manera más rápida posible.</p>
      <p>¡Buena suerte!</p>
      <Cuestionario/>
    </div>
  );
}

export default EquipoPanel;
