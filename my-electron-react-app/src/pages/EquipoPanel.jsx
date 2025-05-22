// src/pages/EquipoPanel.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import QRCode from 'react-qr-code'
import AsistenciaStatus from '../components/asistenciaStatus'
import RandomQuestionPanel from '../components/panelPreguntas'
import EtapaFisicaPanel from '../components/etapaFisica/etapaFisicaPanel'
import './EquipoPanel.css'

export default function EquipoPanel() {
  const { id } = useParams()
  const navigate = useNavigate()

  // — Asistencia —
  const [attendance, setAttendance] = useState({ confirmed: 0, total: 0 })
  const { confirmed, total } = attendance
  const porcentaje = total ? Math.round((confirmed / total) * 100) : 0
  const UMBRAL = 75

  // — Marca de inicio de tiempo (oculta) —
  const [startTime, setStartTime] = useState(null)

  // — Etapas del flujo —
  const [stage, setStage] = useState('pre')

  // — Preguntas —
  const MAX_QUESTIONS = 1
  const [correctCount, setCorrectCount] = useState(0)

  // Cuando se alcanzan las respuestas necesarias, pasamos a física
  useEffect(() => {
    if (stage === 'preguntas' && correctCount >= MAX_QUESTIONS) {
      setStage('fisica')
    }
  }, [correctCount, stage])

  // Inicia el desafío: registro de tiempo + paso a preguntas
  const startDesafio = () => {
    setStartTime(Date.now())
    setStage('preguntas')
  }

  // — Estado de la ruleta —
  const [fisicaUsed, setFisicaUsed] = useState([])
  const [fisicaRound, setFisicaRound] = useState(0)
  useEffect(() => {
    if (stage === 'fisica') {
      setFisicaRound(r => r + 1)
    }
  }, [stage])

  // Callback cuando termina cada giro
  // `isLast === true` sólo en la décima llave
  const handleFisicaComplete = (isLast) => {
    setCorrectCount(0)

    if (isLast && startTime !== null) {
      const durationMs = Date.now() - startTime
      navigate('/fin', { state: { teamId: id, durationMs } })
    } else {
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
            <div className="equipo-panel__qr">
              <QRCode
                value="https://desafiojaguar.zapto.org/"
                size={200}
              />
              <p className="equipo-panel__qr-text">
                Escanea para ir a https://desafiojaguar.zapto.org/
              </p>
            </div>

            <div className="equipo-panel__instructions-box">
              <p>
                Bienvenido a la tercera edición del Desafío Jaguar,
                más remasterizada y jaguarizada que nunca!!!
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
              onClick={startDesafio}
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
          key={fisicaRound}              // fuerza remount en cada ronda
          teamId={id}
          usedIndices={fisicaUsed}
          onUseIndex={idx => setFisicaUsed(u => [...u, idx])}
          round={fisicaRound}
          onComplete={handleFisicaComplete}
        />
      )}
    </div>
  )
}
