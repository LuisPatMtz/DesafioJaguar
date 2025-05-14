import React, { useState } from 'react';
import './contador.css'; 

const ContadorAsistencia = () => {
  const [asistentes, setAsistentes] = useState(0);

  const incrementar = () => {
    setAsistentes(asistentes + 1);
  };


  return (
    <div className="contador-container">
      <h1>Contador de Asistencia</h1>
      <div className="contador-display">{asistentes}</div>
      <div className="contador-botones">
        <button onClick={incrementar}>QR</button>
      </div>
    </div>
  );
};

export default ContadorAsistencia;