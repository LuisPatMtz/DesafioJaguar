import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { CronometroContext } from '../components/cronometro/CronometroContext'
import AsistenciaStatus from '../components/asistenciaStatus'
import RandomQuestionPanel from '../components/panelPreguntas'

function EquipoPanel() {
  const { detenerCronometro } = useContext(CronometroContext)
  const { id } = useParams() // ej. 'equipo1'

  const detener  = () =>{
    detenerCronometro(id)
    console.log('deteniedo cronometro')
  };

  return (
    <div>
      <h2>Bienvenido equipo: {id}</h2>

      <AsistenciaStatus teamId={id} />

      <button onClick={detener}>Pausar cronómetro</button>
      <p>Este es tu panel de participante en el Desafío Jaguar 🐆</p>
      <p>Debes responder las preguntas de la manera más rápida posible.</p>
      <p>¡Buena suerte!</p>
      <RandomQuestionPanel teamId={id}/>
    </div>
  )
}

export default EquipoPanel
