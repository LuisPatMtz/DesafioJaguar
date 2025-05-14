import React, { useState, useEffect } from 'react'

/**
 * Muestra cuantos miembros de un equipo han confirmado asistencia.
 */
export default function AsistenciaStatus({ teamId, refreshInterval = 10000 }) {
  const [attendance, setAttendance] = useState({ confirmed: 0, total: 0 })
  const [error, setError]       = useState(null)

  const API_URL =
    'https://v62mxrdy3g.execute-api.us-east-1.amazonaws.com/prod/contarAsistenciaRDS'

  const fetchAttendance = async () => {
    setError(null)
    try {
      const res = await fetch(`${API_URL}?id_usuario=${teamId}`, { method: 'GET', mode: 'cors' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const { confirmed, total } = await res.json()
      setAttendance({ confirmed, total })
    } catch (err) {
      console.error('Fetch attendance error:', err)
      setError('No se pudo cargar la asistencia.')
    }
  }

  useEffect(() => {
    fetchAttendance()
    const timer = setInterval(fetchAttendance, refreshInterval)
    return () => clearInterval(timer)
  }, [teamId])

  return (
    <div className="asistencia-status">
      <p>
        Asistencia confirmada:{' '}
        <strong>{attendance.confirmed}</strong> /{' '}
        <strong>{attendance.total}</strong>
      </p>
      <button onClick={fetchAttendance}>Refrescar</button>
      {error && <p className="error">{error}</p>}
    </div>
  )
}
