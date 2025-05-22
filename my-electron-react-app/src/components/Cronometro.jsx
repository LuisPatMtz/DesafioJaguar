// src/components/Cronometro.jsx
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

export default function Cronometro({ duration, onFinish }) {
  const [remaining, setRemaining] = useState(duration)

  useEffect(() => {
    if (remaining <= 0) {
      onFinish()
      return
    }

    const interval = setInterval(() => {
      setRemaining(r => r - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [remaining, onFinish])

  const minutes = String(Math.floor(remaining / 60)).padStart(2, '0')
  const seconds = String(remaining % 60).padStart(2, '0')

  return (
    <div className="cronometro">
      Tiempo restante: {minutes}:{seconds}
    </div>
  )
}

Cronometro.propTypes = {
  duration: PropTypes.number.isRequired, // duración en segundos
  onFinish: PropTypes.func.isRequired    // callback cuando el timer llega a 0
}
