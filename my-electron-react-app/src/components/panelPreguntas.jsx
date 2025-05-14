// src/components/panelPreguntas.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './RandomQuestionPanel.css';

export default function RandomQuestionPanel({ teamId, onCorrect }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  // Registra cada respuesta en la base
  const recordResponse = useCallback(
    async (correct, preguntaId, materiaId) => {
      const payload = { equipoId: teamId, preguntaId, materiaId, correcta: correct };
      try {
        await fetch(
          'https://v62mxrdy3g.execute-api.us-east-1.amazonaws.com/prod/recordResponseRDS',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );
      } catch (err) {
        console.error('Error recording response:', err);
      }
    },
    [teamId]
  );

  // Obtiene un nuevo lote de preguntas
  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowFeedback(false);

    try {
      const resp = await fetch(
        'https://v62mxrdy3g.execute-api.us-east-1.amazonaws.com/prod/obtenerPreguntasRDS',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ equipoId: teamId }),
        }
      );
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No hay preguntas disponibles');
      }

      // Normaliza materiaId
      const enriched = data.map((q) => ({
        ...q,
        materiaId: q.materiaId ?? q.materia_id,
      }));

      setQuestions(enriched);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  // Primer fetch al montar o cambiar teamId
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchQuestions();
  }, [fetchQuestions]);

  // Maneja selección de opción
  const handleOptionSelect = (opt) => {
    if (showFeedback) return;
    const current = questions[currentIndex];
    setSelectedOption(opt);
    setShowFeedback(true);

    // registra en DB
    recordResponse(opt.correcta, current.id, current.materiaId);

    // notifica al padre si es correcta
    if (opt.correcta) {
      onCorrect?.();
    }
  };

  // Avanza a la siguiente pregunta o recarga lote
  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      fetchQuestions();
    }
  };

  // Renderizado condicional
  if (isLoading) return <div className="loading">Cargando preguntas...</div>;
  if (error)
    return (
      <div className="error">
        <p>Error: {error}</p>
        <button onClick={fetchQuestions}>Reintentar</button>
      </div>
    );

  const current = questions[currentIndex];
  if (!current) return <div>No se encontró la pregunta</div>;

  return (
    <div className="question-panel">
      <div className="question-container">
        <h3>{current.enunciado}</h3>
        <div className="options-container">
          {current.opciones.map((op, idx) => (
            <button
              key={idx}
              className={`option-btn${
                selectedOption === op ? ' selected' : ''
              }${showFeedback && op.correcta ? ' correct' : ''}${
                showFeedback && selectedOption === op && !op.correcta
                  ? ' incorrect'
                  : ''
              }`}
              onClick={() => handleOptionSelect(op)}
              disabled={showFeedback}
            >
              {op.texto}
            </button>
          ))}
        </div>

        {showFeedback && (
          <div className="feedback">
            <p>{selectedOption.correcta ? '¡Correcto!' : 'Incorrecto'}</p>
            <p>{current.justificacion}</p>
            <button onClick={handleNext}>Siguiente Pregunta</button>
          </div>
        )}
      </div>
    </div>
  );
}
