// src/pages/Fin.jsx
import React, { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './EquipoPanel.css'

const API_URL = 'https://v62mxrdy3g.execute-api.us-east-1.amazonaws.com/prod'

export default function Fin() {
  const { state } = useLocation()
  const navigate  = useNavigate()
  const { durationMs, teamId } = state || {}
  const sentRef   = useRef(false)

  useEffect(() => {
    // Solo ejecuta UNA vez y si tengo teamId + durationMs
    if (sentRef.current || !teamId || durationMs == null) return
    sentRef.current = true

    fetch(`${API_URL}/recordDuration`, {
      method: 'POST',
      mode:   'cors',
      headers: { 'Content-Type': 'application/json' },
      body:   JSON.stringify({ teamId, duration: durationMs })
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(json => console.log('✅ Duración registrada:', json))
      .catch(err => console.error('❌ Error al registrar duración:', err))
  }, [teamId, durationMs])

  const formatTime = ms => {
    const totalSec = Math.floor(ms/1000)
    const m = String(Math.floor(totalSec/60)).padStart(2,'0')
    const s = String(totalSec%60).padStart(2,'0')
    return `${m}:${s}`
  }

  return (
    <div className="equipo-panel">
      <h1 className="equipo-panel__title">¡Felicidades!</h1>
      <h2 className="equipo-panel__subtitle">
        Han completado todas las etapas de esta edición del Desafío Jaguar 3.0
      </h2>

      {durationMs != null && (
        <p className="equipo-panel__subtitle">
          Tiempo total: <strong>{formatTime(durationMs)}</strong>
        </p>
      )}

      <p>Espera los resultados.</p>

      <div className="equipo-panel__start">
        <button
          className="equipo-panel__start-button"
          onClick={() => navigate('/')}
        >
          Volver al inicio
        </button>
      </div>
    </div>
  )
}
