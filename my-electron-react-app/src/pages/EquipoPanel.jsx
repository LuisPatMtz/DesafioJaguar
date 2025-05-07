import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { CronometroContext } from '../components/cronometro/CronometroContext'
import AsistenciaStatus from '../components/asistenciaStatus'

function EquipoPanel() {
  const { detenerCronometro } = useContext(CronometroContext)
  const { id } = useParams() // ej. 'equipo1'

  const detener = () => {
    detenerCronometro(id)
    console.log('Cronómetro detenido para', id)
  }

  return (
    <div>
      <h2>Bienvenido equipo: {id}</h2>

      <AsistenciaStatus teamId={id} />

      <button onClick={detener}>Pausar cronómetro</button>
      <p>Este es tu panel de participante en el Desafío Jaguar 🐆</p>
    </div>
  )
}

export default EquipoPanel
