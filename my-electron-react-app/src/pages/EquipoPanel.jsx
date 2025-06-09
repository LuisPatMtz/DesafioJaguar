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

  const [attendance, setAttendance] = useState({ confirmed: 0, total: 0 })
  const { confirmed, total } = attendance
  const porcentaje = total ? Math.round((confirmed / total) * 100) : 0
  const UMBRAL = 75

  const [startTime, setStartTime] = useState(null)
  const [stage, setStage] = useState('pre')

  const MAX_QUESTIONS = 5
  const [correctCount, setCorrectCount] = useState(0)

  const [countdown, setCountdown] = useState(null)

  useEffect(() => {
    if (stage === 'preguntas' && correctCount >= MAX_QUESTIONS) {
      setStage('fisica')
    }
  }, [correctCount, stage])

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      setStartTime(Date.now())
      setStage('preguntas')
    }
  }, [countdown])

  const startDesafio = () => {
    setCountdown(5)
  }

  const [fisicaUsed, setFisicaUsed] = useState([])
  const [fisicaRound, setFisicaRound] = useState(0)
  useEffect(() => {
    if (stage === 'fisica') {
      setFisicaRound(r => r + 1)
    }
  }, [stage])

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
            Bienvenido <span className="equipo-panel__id">{id}</span>, buena suerte
          </h2>

          <div className="equipo-panel__grid">
            <div className="equipo-panel__qr">
              <QRCode value="https://desafiojaguar.zapto.org/" size={200} />
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
              <p>¡Sé paciente y prepárate para la acción!</p>
            </div>
          </div>

          <AsistenciaStatus teamId={id} onAttendanceChange={setAttendance} />

          {porcentaje >= UMBRAL && (
            <button className="equipo-panel__start-button" onClick={startDesafio}>
              Clic para iniciar desafío… ➔
            </button>
          )}

          {countdown !== null && (
            <div className="equipo-panel__countdown">
              Iniciando en: <strong>{countdown}</strong>
            </div>
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
          key={fisicaRound}
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
