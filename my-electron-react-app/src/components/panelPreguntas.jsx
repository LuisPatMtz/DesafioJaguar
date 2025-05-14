import React, { useState, useEffect } from 'react';
import './RandomQuestionPanel.css';

const RandomQuestionPanel = ({ teamId }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setCurrentQuestion(null);
      
      
      const response = await fetch('https://v62mxrdy3g.execute-api.us-east-1.amazonaws.com/prod/obtenerPreguntasRDS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          equipoId: parse(teamId)
        })
      });
          console.log('Respuesta de la API:', responseData);
          
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const responseData = await response.json();

      console.log('Respuesta de la API:', responseData);
      
      // Parsear correctamente el body que viene como string JSON
      let questions = [];
      if (typeof responseData.body === 'string') {
        try {
          questions = JSON.parse(responseData.body);
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
          throw new Error('Formato de respuesta inválido');
        }
      } else if (Array.isArray(responseData.body)) {
        // Si el body ya es un array (no necesita parseo)
        questions = responseData.body;
      } else if (Array.isArray(responseData)) {
        // Si la respuesta directamente es el array
        questions = responseData;
      }
      
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('No hay preguntas disponibles para este equipo');
      }

      const randomIndex = Math.floor(Math.random() * questions.length);
      setCurrentQuestion(questions[randomIndex]);
      
    } catch (err) {
      setError(err.message);
      console.error('Error fetching questions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (option) => {
    if (!showFeedback) {
      setSelectedOption(option);
      setIsCorrect(option.correcta);
      setShowFeedback(true);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [teamId]);

  if (isLoading) {
    return <div className="loading">Cargando preguntas...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>Error: {error}</p>
        <button onClick={fetchQuestions}>Reintentar</button>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div>No se pudo cargar la pregunta</div>;
  }

  return (
    <div className="question-panel">
      <h2>Pregunta Aleatoria</h2>
      <small>Equipo ID: {teamId}</small>
      
      <div className="question-container">
        <h3>{currentQuestion.enunciado}</h3>
        
        <div className="options-container">
          {currentQuestion.opciones.map((opcion, index) => (
            <button
              key={index}
              className={`option-btn 
                ${selectedOption === opcion ? 'selected' : ''}
                ${showFeedback && opcion.correcta ? 'correct' : ''}
                ${showFeedback && selectedOption === opcion && !opcion.correcta ? 'incorrect' : ''}
              `}
              onClick={() => handleOptionSelect(opcion)}
              disabled={showFeedback}
            >
              {opcion.texto.trim()} {/* Limpia espacios en blanco */}
            </button>
          ))}
        </div>
        
        {showFeedback && (
          <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
            <p>
              {isCorrect ? '¡Correcto!' : 'Incorrecto'}
            </p>
            <p>{currentQuestion.justificacion}</p>
            <button onClick={fetchQuestions}>Siguiente Pregunta</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RandomQuestionPanel;