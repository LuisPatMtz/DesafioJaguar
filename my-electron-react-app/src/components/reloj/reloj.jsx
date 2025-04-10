import React, { useState, useEffect } from 'react';
import './Reloj.css'; // Archivo CSS para estilos

function RelojElectronico() {
  const [hora, setHora] = useState(new Date());
  const [mostrarSegundos, setMostrarSegundos] = useState(true);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setHora(new Date());
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  const formatearNumero = (num) => num.toString().padStart(2, '0');

  const horas = formatearNumero(hora.getHours());
  const minutos = formatearNumero(hora.getMinutes());
  const segundos = formatearNumero(hora.getSeconds());

  const toggleSegundos = () => setMostrarSegundos(!mostrarSegundos);

  return (
    <div className="reloj-container">
      <div 
        className={`reloj-digital ${mostrarSegundos ? 'con-segundos' : ''}`}
        onClick={toggleSegundos}
      >
        <span className="digitos">{horas}</span>
        <span className="separador">:</span>
        <span className="digitos">{minutos}</span>
        {mostrarSegundos && (
          <>
            <span className="separador">:</span>
            <span className="digitos">{segundos}</span>
          </>
        )}
      </div>
      <div className="fecha">
        {hora.toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </div>
    </div>
  );
}

export default RelojElectronico;