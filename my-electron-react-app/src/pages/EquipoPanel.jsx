import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import RandomQuestionPanel from '../components/panelPreguntas'
import EtapaFisicaPanel from '../components/etapaFisica/etapaFisicaPanel'
import './EquipoPanel.css'

export default function EquipoPanel() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [startTime, setStartTime] = useState(null)
  const [stage, setStage] = useState('pre')

  const MAX_QUESTIONS = 5
  const [correctCount, setCorrectCount] = useState(0)

  // Estado para el modal de cuenta regresiva
  const [showCountdown, setShowCountdown] = useState(false)
  const [countdown, setCountdown] = useState(5)

  // Actualiza la etapa fssica
  const [fisicaUsed, setFisicaUsed] = useState([])
  const [fisicaRound, setFisicaRound] = useState(0)

  // Muestra modal e inicia cuenta regresiva
  const startDesafio = () => {
    setShowCountdown(true)
    setCountdown(5)
  }

  // Sincroniza contador
  useEffect(() => {
    let timer
    if (showCountdown) {
      setCountdown(5)
      let counter = 5
      timer = setInterval(() => {
        counter--
        setCountdown(counter)
        if (counter <= 0) clearInterval(timer)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [showCountdown])

  // Al terminar la cuenta, inicia preguntas
  useEffect(() => {
    if (showCountdown && countdown === 0) {
      setTimeout(() => {
        setShowCountdown(false)
        setStartTime(Date.now())
        setStage('preguntas')
      }, 500) 
    }
  }, [showCountdown, countdown])

  // Avanza a etapa física cuando se completan las preguntas
  useEffect(() => {
    if (stage === 'preguntas' && correctCount >= MAX_QUESTIONS) {
      setStage('fisica')
    }
  }, [correctCount, stage])

  // Incrementa la ronda física al iniciar esta etapa
  useEffect(() => {
    if (stage === 'fisica') {
      setFisicaRound(r => r + 1)
    }
  }, [stage])

  const handleFisicaComplete = (isLast) => {
    setCorrectCount(0)

    if (isLast && startTime !== null) {
      const durationMs = Date.now() - startTime
      navigate('/fin', { state: { teamId: id, durationMs } })
    } else {
      setStage('preguntas')
    }
  }

  useEffect(() => {
    if (showCountdown) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
    }
    return () => document.body.classList.remove('modal-open')
  }, [showCountdown])

  return (
    <div className="equipo-panel">
      {showCountdown && (
        <div className="countdown-modal">
          <div className="countdown-content">
            <h2>¡Prepárate!</h2>
            <div className="countdown-number">
              {countdown > 0 ? countdown : "¡A jugar!"}
            </div>
          </div>
        </div>
      )}

      {stage === 'pre' && (
        <>
          <h2 className="equipo-panel__title">
            Bienvenido <span className="equipo-panel__id">{id}</span> al Desafío Jaguar 3.0!
          </h2>
          <div className="equipo-panel__instructions-box">
            <p>
              Prepárate para una experiencia unica e inigualable: primero, pondrás a prueba tu conocimiento obtenido por las sabias clases de tus maestros favoritos, ¿O no?.
            </p>
            <p>
              Al hacer clic en <em>“Clic aqui para iniciar desafio…➔”</em>, se activará el cronómetro y tendrás que responder cada pregunta de forma correcta y rápida. Sé estratégico: la eficiencia cuenta.
            </p>
            <p>
              Una vez que completes las preguntas, pasarás directamente a la <strong>etapa física</strong>, donde aparecera una ruleta con 8 llaves. Cada opcion contendrá una pista que te llevará a una llave escondida en la escuela.
            </p>
            <p>
              Tendras pistas de donde encontrar las llaves, pero cuidado: si fallas tres veces, obtendras una penalizacion que se sumará a tu tiempo total. ¡No te rindas!
            </p>
            <p>
              Tu tiempo total será registrado desde el inicio hasta que completes la ruleta. ¡El equipo más rápido será el ganador!
            </p>
            <p>
              Consejo: Respira hondo, mantén la concentración y trabaja en equipo. ¡Mucha suerte, y que comience la aventura!
            </p>
          </div>

          <button className="equipo-panel__start-button" onClick={startDesafio} disabled={showCountdown}>
            Clic aqui para iniciar desafio…➔
          </button>
        </>
      )}

      {stage === 'preguntas' && (
        <>
          <h2 className="equipo-panel__title">🧠 Etapa academica 🧐</h2>
          <p className="equipo-panel__subtitle">
            Demuestren que son unos masters: respondan correctamente las 5 preguntas.
          </p>

          <div className="equipo-panel__question-box">
            <RandomQuestionPanel
              teamId={id}
              onCorrect={() => setCorrectCount(c => c + 1)}
            />
          </div>

          <div className="equipo-panel__score">
            Llevas {correctCount} respuestas correctas de {MAX_QUESTIONS}
          </div>
        </>
      )}

      {stage === 'fisica' && (
        <>
          <h2 className="equipo-panel__title">🏃‍♂️ Encuentra las llaves</h2>
          <p className="equipo-panel__subtitle">
            Completen la ruleta en el menor tiempo posible.
          </p>
          <EtapaFisicaPanel
            key={fisicaRound}
            teamId={id}
            usedIndices={fisicaUsed}
            onUseIndex={idx => setFisicaUsed(u => [...u, idx])}
            round={fisicaRound}
            onComplete={handleFisicaComplete}
          />
        </>
      )}
    </div>
  )
}
