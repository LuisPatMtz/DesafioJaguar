// src/pages/EquipoPanel.jsx
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import QRCode from 'react-qr-code'
import AsistenciaStatus from '../components/asistenciaStatus'
import RandomQuestionPanel from '../components/panelPreguntas'
import './EquipoPanel.css'

export default function EquipoPanel() {
  const { id } = useParams()
  const [attendance, setAttendance] = useState({ confirmed: 0, total: 0 })
  const [started, setStarted]       = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const MAX_QUESTIONS = 5

  const { confirmed, total } = attendance
  const porcentaje = total ? Math.round((confirmed / total) * 100) : 0
  const UMBRAL    = 75

  return (
    <div className="equipo-panel">
      {/* ===== PRE-START ===== */}
      {!started && (
        <>
          <h2 className="equipo-panel__title">
            Bienvenido, equipo: <span className="equipo-panel__id">{id}</span>
          </h2>

          <div className="equipo-panel__grid">
            <div className="equipo-panel__qr">
              <QRCode
                value="https://desafiojaguar.zapto.org/"
                size={300}
                level="M"
              />
              <p className="equipo-panel__qr-text">
                Escanea para ir a desafiojaguar.zapto.org
              </p>
            </div>

            <div className="equipo-panel__instructions-box">
              <p>
                Bienvenido a la tercera edición del Desafío Jaguar, más
                remasterizada y jaguarizada que nunca!!!
              </p>
              <p>
                Escanea este QR para confirmar tu asistencia, el desafío solo
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
              onClick={() => setStarted(true)}
            >
              Clic para iniciar desafío… ➔
            </button>
          )}
        </>
      )}

      {/* ===== POST-START: ETAPA DE PREGUNTA ===== */}
      {started && (
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
    </div>
  )
}
