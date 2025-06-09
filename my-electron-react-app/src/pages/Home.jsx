import React from 'react'
import fondo from '../resources/Fondo.jpg'
import Login from '../components/Login'
import './Home.css'

function Home() {
  return (
    <div
      className="home-container"
      style={{
        height: '100vh', // ✅ asegura altura completa
        width: '100vw',  // ✅ asegura ancho completo
        margin: 0,
        padding: 0,
        backgroundImage: `url(${fondo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <h1 className="home-title">Bienvenidos al Desafío Jaguar</h1>
      <p className="home-subtitle">Inicia sesion con el usuario y contraseña indicados.</p>
      <Login />
    </div>
  )
}

export default Home
