// src/components/etapaFisica/etapaFisicaPanel.jsx
import React, { useState, useEffect, useMemo } from 'react'
import { Wheel } from 'react-custom-roulette'
import './etapaFisicaPanel.css'
import { verifyKey } from '../../utils/verifyKey'

export default function EtapaFisicaPanel({
  teamId,
  usedIndices,
  onUseIndex,
  round,
  onComplete
}) {
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

  // Estados
  const [mustSpin, setMustSpin]           = useState(false)
  const [prizeNumber, setPrizeNumber]     = useState(0)
  const [currentWinner, setCurrentWinner] = useState(null)
  const [modalType, setModalType]         = useState(null)
  const [selectedKey, setSelectedKey]     = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState('')

  // Lanzar giro cuando cambie round (y no haya modal o ganador pendiente)
  useEffect(() => {
    if (modalType !== null || currentWinner !== null) return

    const available = segments
      .map((_, i) => i)
      .filter(i => !usedIndices.includes(i))
    if (!available.length) return

    const next = available[Math.floor(Math.random() * available.length)]
    setPrizeNumber(next)
    setMustSpin(true)
  }, [round, modalType, currentWinner, segments, usedIndices])

  const handleStop = () => {
    setMustSpin(false)
    setCurrentWinner(prizeNumber)

    const choice = segments[prizeNumber]
    if (choice === 'Desafíos físicos') {
      setModalType('fisicos')
    } else if (choice === 'Retos de carrera') {
      setModalType('carrera')
    } else {
      setSelectedKey(choice)
      setPasswordInput('')
      setPasswordError('')
      setModalType('password')
    }
  }

  const handlePasswordAccept = () => {
    if (verifyKey(teamId, selectedKey, passwordInput)) {
      setModalType('llave')
    } else {
      setPasswordError('Contraseña incorrecta')
    }
  }

  const closeModal = () => {
    onUseIndex(currentWinner)
    onComplete()
    setModalType(null)
    setCurrentWinner(null)
  }

  const data = useMemo(() => {
    return segments.map((opt, i) => {
      const isWinner = currentWinner === i
      const isUsed   = usedIndices.includes(i) || isWinner
      return {
        option: opt,
        style: {
          backgroundColor: isUsed
            ? realColors[i]
            : '#ccc',
          textColor: '#fff',
          border: isWinner
            ? '4px solid #fff'
            : 'none'
        }
      }
    })
  }, [segments, realColors, usedIndices, currentWinner])

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

      {modalType === 'password' && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Introduce la contraseña para {selectedKey}</h3>
            <input
              type="password"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              placeholder="Contraseña"
            />
            {passwordError && <p className="error">{passwordError}</p>}
            <button onClick={handlePasswordAccept}>Aceptar</button>
          </div>
        </div>
      )}

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
