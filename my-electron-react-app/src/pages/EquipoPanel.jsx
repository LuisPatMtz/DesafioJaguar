import React from 'react';
import './EquipoPanel.css';

function EquipoPanel() {
  const targetUrl = 'https://desafiojaguar.zapto.org/';

  // Debug: Imprime la ruta en consola para verificar
  const backgroundImage = '/images/jaguar-bg.png';
  console.log('Ruta de la imagen:', backgroundImage); // Verifica en la consola del navegador

  const handleClick = () => {
    window.location.href = targetUrl;
  };

  return (
    <div 
      className="jaguar-minimal-container"
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        border: '2px solid red' // ⚠️ Borde temporal para debug 
      }}
    >
      <h1>Bienvenido al desafío Jaguar 3.0</h1>
      <div className="divider"></div>
      <div onClick={handleClick} className="qr-minimal-wrapper">
        <img 
          src="/images/qr-jaguar-transparente.png" 
          alt="QR Jaguar" 
          className="qr-minimal-image"
        />
      </div>
      <p>Escaneea el siguiente código QR para comenzar</p>
    </div>
  );
}

export default EquipoPanel;