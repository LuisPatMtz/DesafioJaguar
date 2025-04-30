import React from 'react';
import fondo from '../resources/Fondo.jpg';
import Login from '../components/Login';
import './Home.css';

function Home() {
  return (
    <div
      className="home-container"
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        color: 'white',
      }}
    >
      <h1>Bienvenidos al desafío jaguar 🐆</h1>
      <p>Inicia sesión con el usuario y contraseña indicadas.</p>

      <Login />
    </div>
  );
}

export default Home;
