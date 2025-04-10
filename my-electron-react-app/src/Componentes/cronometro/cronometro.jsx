import React, { useState, useEffect, useRef } from 'react';
import './Cronometro.css'; // Archivo de estilos

const Cronometro = () => {
  const [tiempo, setTiempo] = useState(0);
  const [activo, setActivo] = useState(false);
  const [vueltas, setVueltas] = useState([]);
  const intervaloRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }
    };
  }, []);

  const iniciar = () => {
    if (!activo) {
      setActivo(true);
      intervaloRef.current = setInterval(() => {
        setTiempo(prevTiempo => prevTiempo + 10);
      }, 10);
    }
  };

  const detener = () => {
    if (activo) {
      clearInterval(intervaloRef.current);
      setActivo(false);
    }
  };

  const resetear = () => {
    detener();
    setTiempo(0);
    setVueltas([]);
  };

  const guardarVuelta = () => {
    if (activo) {
      setVueltas(prevVueltas => [...prevVueltas, formatearTiempo(tiempo)]);
    }
  };

  const formatearTiempo = (time) => {
    const horas = Math.floor(time / 3600000);
    const minutos = Math.floor((time % 3600000) / 60000);
    const segundos = Math.floor((time % 60000) / 1000);
    const milisegundos = time % 1000;

    return {
      horas: horas.toString().padStart(2, '0'),
      minutos: minutos.toString().padStart(2, '0'),
      segundos: segundos.toString().padStart(2, '0'),
      milisegundos: milisegundos.toString().padStart(3, '0').slice(0, 2)
    };
  };

  const { horas, minutos, segundos, milisegundos } = formatearTiempo(tiempo);

  return (
    <div className="cronometro-container">
      <h2>Cronómetro Electrónico</h2>
      
      <div className="display">
        <span>{horas}:</span>
        <span>{minutos}:</span>
        <span>{segundos}.</span>
        <span className="milisegundos">{milisegundos}</span>
      </div>

      <div className="controles">
        <button onClick={iniciar} disabled={activo}>Iniciar</button>
        <button onClick={detener} disabled={!activo}>Detener</button>
        <button onClick={guardarVuelta} disabled={!activo}>Guardar Tiempo</button>
        <button onClick={resetear}>Resetear</button>
      </div>

      {vueltas.length > 0 && (
        <div className="vueltas-container">
          <h3>Tiempos Guardados:</h3>
          <ul>
            {vueltas.map((vuelta, index) => (
              <li key={index}>
                Vuelta {index + 1}: {vuelta.horas}:{vuelta.minutos}:{vuelta.segundos}.{vuelta.milisegundos}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Cronometro;