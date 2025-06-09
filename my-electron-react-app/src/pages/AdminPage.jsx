import React, { useState, useEffect } from 'react'
import './AdminPage.css'
import TiempoModal from '../components/TiempoModal'
import { generarResultadosPPTX } from '../utils/generarResultadosPPTX'

export default function AdminPage() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [idSeleccionado, setIdSeleccionado] = useState(null)
  const [equipoSeleccionado, setEquipoSeleccionado] = useState('')

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch('https://v62mxrdy3g.execute-api.us-east-1.amazonaws.com/prod/getResults')
        const payload = await res.json()
        const outer = typeof payload.body === 'string' ? JSON.parse(payload.body) : payload

        if (!outer.data) throw new Error('Respuesta mal formateada: no hay campo data')

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

  const formatTime = (ms = 0) => {
    if (!ms || isNaN(ms)) return '00:00'
    const totalSec = Math.floor(ms / 1000)
    const min = String(Math.floor(totalSec / 60)).padStart(2, '0')
    const sec = String(totalSec % 60).padStart(2, '0')
    return `${min}:${sec}`
  }

  const handleAgregarTiempoDesdeModal = async (id_resultado, tiempoMs) => {
    try {
      const res = await fetch('https://v62mxrdy3g.execute-api.us-east-1.amazonaws.com/prod/agregarTiempoFisicoRDS', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_resultado,
          tiempo_extra_ms: tiempoMs
        })
      })
      const data = await res.json()
      alert(data.mensaje || 'Tiempo agregado')

      // Refrescar tabla
      setLoading(true)
      setResults([])
      const nueva = await fetch('https://v62mxrdy3g.execute-api.us-east-1.amazonaws.com/prod/getResults')
      const payload = await nueva.json()
      const outer = typeof payload.body === 'string' ? JSON.parse(payload.body) : payload
      setResults(outer.data)
      setLoading(false)
    } catch (err) {
      alert('Error al agregar tiempo')
    }
  }

  const abrirModal = (id, equipo) => {
    setIdSeleccionado(id)
    setEquipoSeleccionado(equipo)
    setModalAbierto(true)
  }

  const handleExportarPPTX = () => {
    const formateados = results.map((r) => {
      const total = (r.duration_ms || 0) + (r.tiempo_extra_ms || 0)
      return {
        nombre: r.equipo,
        original: formatTime(r.duration_ms),
        fisico: formatTime(r.tiempo_extra_ms),
        total: formatTime(total),
        total_ms: total
      }
    })
    generarResultadosPPTX(formateados)
  }

  if (loading) return <p className="mensaje">Cargando resultados…</p>
  if (error) return <p className="mensaje error">Error: {error}</p>

  return (
    <div className="admin-page">
      <h1>Resultados</h1>
      <button className="btn-exportar" onClick={handleExportarPPTX}>Exportar a PPTX</button>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Equipo</th>
            <th>Original</th>
            <th>Físico</th>
            <th>Total</th>
            <th>Erróneas</th>
            <th>Agregar tiempo</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => {
            const totalMs = r.duration_ms + (r.tiempo_extra_ms || 0)
            const yaTieneTiempo = (r.tiempo_extra_ms || 0) > 0

            return (
              <tr key={r.id_resultado}>
                <td>{r.equipo}</td>
                <td>{formatTime(r.duration_ms)}</td>
                <td>{formatTime(r.tiempo_extra_ms)}</td>
                <td>{formatTime(totalMs)}</td>
                <td>{r.preguntas_erroneas}</td>
                <td>
                  <button onClick={() => abrirModal(r.id_resultado, r.equipo)}>
                    {yaTieneTiempo ? 'Editar' : 'Agregar'}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {modalAbierto && (
        <TiempoModal
          equipo={equipoSeleccionado}
          id_resultado={idSeleccionado}
          onClose={() => setModalAbierto(false)}
          onConfirm={handleAgregarTiempoDesdeModal}
        />
      )}
    </div>
  )
}
