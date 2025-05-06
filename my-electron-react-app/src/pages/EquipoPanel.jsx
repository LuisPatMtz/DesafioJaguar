import React from 'react';
<<<<<<< HEAD
import './EquipoPanel.css';

function EquipoPanel() {
  const targetUrl = 'https://desafiojaguar.zapto.org/';

  // Debug: Imprime la ruta en consola para verificar
  const backgroundImage = '/images/jaguar-bg.png';
  console.log('Ruta de la imagen:', backgroundImage); // Verifica en la consola del navegador

  const handleClick = () => {
    window.location.href = targetUrl;
  };
=======
import { useParams } from 'react-router-dom';
import { CronometroContext } from '../components/cronometro/CronometroContext';


function EquipoPanel() {
  const { detenerCronometro} = React.useContext(CronometroContext); // obtiene el contexto del cronómetro
  const { id } = useParams(); // obtiene el id de la URL
>>>>>>> a3b75ceef4bd9a263b1e149c2ed3618a564bf441

  const detener  = () =>{
    detenerCronometro(id)
    console.log('deteniedo cronometro')
  };

  return (
<<<<<<< HEAD
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
=======
    <div>
      <h2>Bienvenido equipo: {id}</h2>
      <button onClick={detener}>pausa</button>
      <p>Este es tu panel de participante en el Desafío Jaguar 🐆</p>
>>>>>>> a3b75ceef4bd9a263b1e149c2ed3618a564bf441
    </div>
  );
}

export default EquipoPanel;