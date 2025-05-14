import React, { useState, useEffect, useRef, useCallback } from 'react';
import './RandomQuestionPanel.css';

const RandomQuestionPanel = ({ teamId, onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  // Registra cada respuesta en la base
  const recordResponse = useCallback(async (correct, preguntaId, materiaId) => {
    const payload = { equipoId: teamId, preguntaId, materiaId, correcta: correct };
    try {
      await fetch(
        'https://v62mxrdy3g.execute-api.us-east-1.amazonaws.com/prod/recordResponseRDS',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );
    } catch (err) {
      console.error('Error recording response:', err);
    }
  }, [teamId]);

  // Obtiene un nuevo lote de preguntas (8)
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
          body: JSON.stringify({ equipoId: teamId })
        }
      );
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No hay preguntas disponibles');
      }

      // Normaliza materiaId
      const enriched = data.map(q => ({
        ...q,
        materiaId: q.materiaId ?? q.materia_id
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

  // Selección de opción
  const handleOptionSelect = (opt) => {
    if (showFeedback) return;
    const current = questions[currentIndex];
    setSelectedOption(opt);
    setShowFeedback(true);
    recordResponse(opt.correcta, current.id, current.materiaId);
  };

  // Avanza o recarga lote
  const handleNext = () => {
    const wasCorrect = selectedOption.correcta;
    const newCorrect = correctCount + (wasCorrect ? 1 : 0);
    setCorrectCount(newCorrect);

    // Al llegar a 5 aciertos, finaliza
    if (newCorrect >= 5) {
      onComplete?.();
      return;
    }

    const nextIndex = currentIndex + 1;
    // Si quedan preguntas en el lote, avanzamos
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      // si se acabaron, pedimos otro lote
      fetchQuestions();
    }
  };

  // Render
  if (isLoading) return <div className="loading">Cargando preguntas...</div>;
  if (error) return (
    <div className="error">
      <p>Error: {error}</p>
      <button onClick={fetchQuestions}>Reintentar</button>
    </div>
  );

  const current = questions[currentIndex];
  if (!current) return <div>No se encontró la pregunta</div>;

  return (
    <div className="question-panel">
      <h2>Pregunta Aleatoria</h2>
      <small>Equipo ID: {teamId}</small>
      <div className="progress">
        {`Aciertos: ${correctCount}/5`}
      </div>

      <div className="question-container">
        <h3>{current.enunciado}</h3>
        <div className="options-container">
          {current.opciones.map((op, idx) => (
            <button
              key={idx}
              className={`option-btn${selectedOption===op?' selected':''}${showFeedback&&op.correcta?' correct':''}${showFeedback&&selectedOption===op&&!op.correcta?' incorrect':''}`}
              onClick={() => handleOptionSelect(op)}
              disabled={showFeedback}
            >{op.texto}</button>
          ))}
        </div>

        {showFeedback && (
          <div className={`feedback ${selectedOption.correcta?'correct':'incorrect'}`}>
            <p>{selectedOption.correcta ? '¡Correcto!' : 'Incorrecto'}</p>
            <p>{current.justificacion}</p>
            <button onClick={handleNext}>Siguiente Pregunta</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RandomQuestionPanel;
