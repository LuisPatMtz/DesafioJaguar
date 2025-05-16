// src/components/etapaFisica/etapaFisicaPanel.jsx
import React, { useState, useEffect, useMemo } from 'react'
import { Wheel } from 'react-custom-roulette'
import './etapaFisicaPanel.css'

export default function EtapaFisicaPanel({
  teamId,
  usedIndices,
  onUseIndex,
  round,
  onComplete
}) {
  // colores definitivos
  const realColors = [
    '#FF6B6B', '#6BCB77', '#4D96FF',
    '#FFD93D', '#9D4EDD', '#FF6AC1',
    '#6BEAFF', '#FF9F1C', '#2EC4B6',
    '#FFBF69'
  ]
  const segments = [
    'Llave 1','Llave 2','Llave 3','Llave 4',
    'Desafíos físicos','Llave 5','Llave 6',
    'Llave 7','Llave 8','Retos de carrera'
  ]

  const [mustSpin, setMustSpin]    = useState(false)
  const [prizeNumber, setPrizeNumber] = useState(0)
  const [modalType, setModalType]  = useState(null)
  const [selectedKey, setSelectedKey] = useState('')

  // cada vez que cambie `round`, lanzamos un nuevo giro
  useEffect(() => {
    const available = segments
      .map((_, i) => i)
      .filter(i => !usedIndices.includes(i))
    if (!available.length) return
    const next = available[Math.floor(Math.random() * available.length)]
    setPrizeNumber(next)
    setMustSpin(true)
  }, [round])

  const handleStop = () => {
    setMustSpin(false)
    onUseIndex(prizeNumber)  // notifico al padre que este índice ya se usó

    const choice = segments[prizeNumber]
    if (choice === 'Desafíos físicos')        setModalType('fisicos')
    else if (choice === 'Retos de carrera') setModalType('carrera')
    else {
      setSelectedKey(choice)
      setModalType('llave')
    }
  }

  const closeModal = () => {
    setModalType(null)
    onComplete()
  }

  // reconstruimos `data` a partir de usedIndices y prizeNumber
  const data = useMemo(() => {
    return segments.map((opt, i) => {
      const used = usedIndices.includes(i)
      return {
        option: opt,
        style: {
          backgroundColor: used
            ? realColors[i]
            : '#ccc',
          textColor: '#fff',
          border:
            !mustSpin && prizeNumber === i
              ? '4px solid #fff'
              : 'none'
        }
      }
    })
  }, [segments, realColors, usedIndices, mustSpin, prizeNumber])

  return (
    <div className="etapa-fisica-panel">
      <h2>Etapa Física</h2>
      <p>Equipo: {teamId}</p>

      <div className="wheel-container">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          outerBorderColor="#444"
          outerBorderWidth={2}
          innerRadius={15}
          radiusLineWidth={2}
          radiusLineColor="#666"
          textDistance={60}
          onStopSpinning={handleStop}
        />
      </div>

      {/* modales idénticos a antes */}
      {modalType === 'llave' && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>¡Has obtenido {selectedKey}!</h3>
            <button onClick={closeModal}>Continuar</button>
          </div>
        </div>
      )}
      {modalType === 'fisicos' && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Desafíos físicos</h3>
            <ul>
              <li>Encestar la canasta</li>
              <li>Construir torre de vasos</li>
              <li>Lanzamiento de aros</li>
              <li>Carrera</li>
            </ul>
            <button onClick={closeModal}>Continuar</button>
          </div>
        </div>
      )}
      {modalType === 'carrera' && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Desafíos de carrera</h3>
            <ul>
              <li>Ponchar un cable de red</li>
              <li>Programar dos “Hola Mundo”</li>
              <li>Debug rápido de código</li>
            </ul>
            <button onClick={closeModal}>Continuar</button>
          </div>
        </div>
      )}
    </div>
  )
}
