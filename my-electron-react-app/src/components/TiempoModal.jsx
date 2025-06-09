import React, { useState } from 'react'
import './TiempoModal.css'

export default function TiempoModal({ equipo, id_resultado, onClose, onConfirm }) {
  const [tiempo, setTiempo] = useState('')

  const esValido = /^\d{1,2}:\d{2}$/.test(tiempo)

  const convertirATiempoMs = () => {
    const [min, sec] = tiempo.split(':').map(Number)
    if (isNaN(min) || isNaN(sec) || sec > 59 || min < 0 || sec < 0) return null
    return (min * 60 + sec) * 1000
  }

  const handleGuardar = () => {
    const tiempoMs = convertirATiempoMs()
    if (!tiempoMs) {
      alert('Tiempo inválido. Usa el formato mm:ss')
      return
    }
    onConfirm(id_resultado, tiempoMs)
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Agregar tiempo físico</h2>
        <p>Equipo: <strong>{equipo}</strong></p>
        <p>Ingresa el tiempo en formato <strong>mm:ss</strong> (ejemplo: 03:45)</p>
        <input
          type="text"
          value={tiempo}
          onChange={e => setTiempo(e.target.value)}
          placeholder="mm:ss"
          className={esValido ? '' : 'input-error'}
        />
        <div className="modal-buttons">
          <button onClick={handleGuardar} disabled={!esValido}>Guardar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  )
} 
