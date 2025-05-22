// src/pages/AdminPage.jsx
import React, { useState, useEffect } from 'react'
import './AdminPage.css'

export default function AdminPage() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch(
          'https://v62mxrdy3g.execute-api.us-east-1.amazonaws.com/prod/getResults',
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          }
        )
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }

        // tu Lambda responde:
        // {
        //   statusCode: 200,
        //   headers: { … },
        //   body: "{\"data\":[{…}]}"
        // }
        const payload = await res.json()

        // body viene serializado como string JSON → lo parseamos:
        const outer = typeof payload.body === 'string'
          ? JSON.parse(payload.body)
          : payload

        if (!outer.data) {
          throw new Error('Respuesta mal formateada: no hay campo data')
        }

        setResults(outer.data)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [])

  const formatTime = ms => {
    const totalSec = Math.floor(ms / 1000)
    const min      = String(Math.floor(totalSec / 60)).padStart(2,'0')
    const sec      = String(totalSec % 60).padStart(2,'0')
    return `${min}:${sec}`
  }

  if (loading) return <p>Cargando resultados…</p>
  if (error)   return <p style={{ color: 'red' }}>Error: {error}</p>

  return (
    <div className="admin-page">
      <h1>Resultados</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Equipo</th>
            <th>Tiempo total</th>
            <th>Preguntas erróneas</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, idx) => (
            <tr key={idx}>
              <td>{r.equipo}</td>
              <td>{formatTime(r.duration_ms)}</td>
              <td>{r.preguntas_erroneas}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
