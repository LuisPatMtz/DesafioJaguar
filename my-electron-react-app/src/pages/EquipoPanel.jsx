// src/pages/EquipoPanel.jsx
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import QRCode from 'react-qr-code'
import AsistenciaStatus from '../components/asistenciaStatus'
import RandomQuestionPanel from '../components/panelPreguntas'
import EtapaFisicaPanel from '../components/etapaFisica/etapaFisicaPanel'
import './EquipoPanel.css'

export default function EquipoPanel() {
  const { id } = useParams()

  // — Asistencia —
  const [attendance, setAttendance] = useState({ confirmed: 0, total: 0 })
  const { confirmed, total } = attendance
  const porcentaje = total ? Math.round((confirmed / total) * 100) : 0
  const UMBRAL = 75

  // — Etapas del flujo —
  // 'pre'      = antes de empezar
  // 'preguntas'= respondiendo preguntas
  // 'fisica'   = etapa física (ruleta)
  // 'done'     = completado
  const [stage, setStage] = useState('pre')

  // — Preguntas —
  const MAX_QUESTIONS = 5
  const [correctCount, setCorrectCount] = useState(0)

  // cuando lleguemos a 5 aciertos, pasamos a etapa física
  useEffect(() => {
    if (stage === 'preguntas' && correctCount >= MAX_QUESTIONS) {
      setStage('fisica')
    }
  }, [correctCount, stage])

  // — Estado de la ruleta (lifting state) —
  const [fisicaUsed,    setFisicaUsed]    = useState([])
  const [fisicaRound,   setFisicaRound]   = useState(0)

  // cada vez que entramos en 'fisica', aumentamos la ronda
  useEffect(() => {
    if (stage === 'fisica') {
      setFisicaRound(r => r + 1)
    }
  }, [stage])

  // cuando la etapa física avisa que completó un giro
  const handleFisicaComplete = () => {
    // reseteamos contador de preguntas
    setCorrectCount(0)

    // si ya usamos todos los 10 segmentos, marcamos 'done'
    if (fisicaUsed.length >= 10) {
      setStage('done')
    } else {
      // de lo contrario, volvemos a preguntas
      setStage('preguntas')
    }
  }

  return (
    <div className="equipo-panel">
      {stage === 'pre' && (
        <>
          <h2 className="equipo-panel__title">
            Bienvenido, equipo: <span className="equipo-panel__id">{id}</span>
          </h2>

          <div className="equipo-panel__grid">
            {/* QR */}
            <div className="equipo-panel__qr">
              <QRCode value="https://desafiojaguar.zapto.org/" size={200} />
              <p className="equipo-panel__qr-text">
                Escanea para ir a desafiojaguar.zapto.org
              </p>
            </div>
            {/* Instrucciones */}
            <div className="equipo-panel__instructions-box">
              <p>
                Bienvenido a la tercera edición del Desafío Jaguar, más
                remasterizada y jaguarizada que nunca!!!
              </p>
              <p>
                Escanea este QR para confirmar tu asistencia. El desafío solo
                comenzará cuando el 75 % de tu equipo esté presente.
              </p>
              <p>Sé paciente.</p>
            </div>
          </div>

          <AsistenciaStatus
            teamId={id}
            onAttendanceChange={setAttendance}
          />

          {porcentaje >= UMBRAL && (
            <button
              className="equipo-panel__start-button"
              onClick={() => setStage('preguntas')}
            >
              Clic para iniciar desafío… ➔
            </button>
          )}
        </>
      )}

      {stage === 'preguntas' && (
        <>
          <h2 className="equipo-panel__title">Etapa de pregunta</h2>
          <p className="equipo-panel__subtitle">
            Responde de manera correcta la pregunta
          </p>

          <div className="equipo-panel__question-box">
            <RandomQuestionPanel
              teamId={id}
              onCorrect={() => setCorrectCount(c => c + 1)}
            />
          </div>

          <div className="equipo-panel__score">
            Aciertos: {correctCount} / {MAX_QUESTIONS}
          </div>
        </>
      )}

      {stage === 'fisica' && (
        <EtapaFisicaPanel
          teamId={id}
          usedIndices={fisicaUsed}
          onUseIndex={idx => setFisicaUsed(u => [...u, idx])}
          round={fisicaRound}
          onComplete={handleFisicaComplete}
        />
      )}

      {stage === 'done' && (
        <div className="etapa-final">
          <h2>¡Felicidades!</h2>
          <p>Han completado todas las etapas.</p>
        </div>
      )}
    </div>
  )
}
