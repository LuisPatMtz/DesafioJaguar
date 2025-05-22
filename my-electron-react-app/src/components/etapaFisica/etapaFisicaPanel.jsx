import React, { useState, useEffect, useMemo } from 'react'
import { Wheel } from 'react-custom-roulette'
import './etapaFisicaPanel.css'
import { verifyKey } from '../../utils/verifyKey'

const SEGMENTS = [
  'Llave 1','Llave 2','Llave 3','Llave 4',
  'Llave 5','Llave 6',
  'Llave 7','Llave 8'
]
const REAL_COLORS = [
  '#FF6B6B','#6BCB77','#4D96FF',
  '#FFD93D','#9D4EDD','#FF6AC1',
  '#6BEAFF','#FF9F1C'
]

export default function EtapaFisicaPanel({
  teamId, usedIndices, onUseIndex, round, onComplete
}) {
  const [mustSpin, setMustSpin]           = useState(false)
  const [prizeNumber, setPrizeNumber]     = useState(0)
  const [currentWinner, setCurrentWinner] = useState(null)
  const [modalType, setModalType]         = useState(null)
  const [selectedKey, setSelectedKey]     = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    if (modalType || currentWinner !== null) return

    const available = SEGMENTS
      .map((_, i) => i)
      .filter(i => !usedIndices.includes(i))
    
    // Si no quedan, notificamos “última” y salimos
    if (!available.length) {
      onComplete(true)
      return
    }

    const next = available[Math.floor(Math.random() * available.length)]
    setPrizeNumber(next)
    setMustSpin(true)
  }, [round, usedIndices, modalType, currentWinner, onComplete])

  const handleStop = () => {
    setMustSpin(false)
    setCurrentWinner(prizeNumber)

    // Guarda qué "llave" salió
    const choice = SEGMENTS[prizeNumber]
    setSelectedKey(choice)

    // Abre el modal para pedir contraseña
    setModalType('password')
  }

  const handlePasswordAccept = () => {
    if (verifyKey(teamId, selectedKey, passwordInput)) {
      setModalType('llave')
      setPasswordError('')
    } else {
      setPasswordError('Contraseña incorrecta')
    }
  }

  const closeModal = () => {
    // Marcamos este índice como usado
    onUseIndex(currentWinner)
    // Si era la décima llave, avisamos con `true`
    const isLast = usedIndices.length + 1 >= SEGMENTS.length
    onComplete(isLast)
    setModalType(null)
    setCurrentWinner(null)
    setPasswordInput('')
    setPasswordError('')
    setSelectedKey('')
  }

  const data = useMemo(() =>
    SEGMENTS.map((opt, i) => ({
      option: opt,
      style: {
        backgroundColor: (usedIndices.includes(i) || currentWinner === i)
          ? REAL_COLORS[i]
          : '#ccc',
        textColor: '#fff',
        border: currentWinner === i ? '4px solid #fff' : 'none'
      }
    }))
  , [usedIndices, currentWinner])

  return (
    <div className="etapa-fisica-panel">
      <h2>Etapa física</h2>
      <h3>Equipo: {teamId}</h3>
      <h3>Espera las indicaciones</h3>
      <div className="wheel-container">
        <Wheel
          key={round}
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          spinDuration={0.75}
          startingOptionIndex={0}
          disableInitialAnimation
          outerBorderColor="#444"
          outerBorderWidth={2}
          innerRadius={15}
          radiusLineWidth={2}
          radiusLineColor="#666"
          textDistance={60}
          onStopSpinning={handleStop}
        />
      </div>

      {/* modales */}
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
            <h3>¡Felicidades, has encontrado la {selectedKey}!</h3>
            <button onClick={closeModal}>Continuar</button>
          </div>
        </div>
      )}
    </div>
  )
}
