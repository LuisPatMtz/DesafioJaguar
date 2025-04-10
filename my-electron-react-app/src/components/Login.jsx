import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usuarios from '../data/usuarios.json';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  const manejarLogin = () => {
    const usuario = usuarios.find(
      (u) => u.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (!usuario) {
      setError('Usuario no encontrado');
      return;
    }

    if (usuario.contrasena !== contrasena) {
      setError('Contraseña incorrecta');
      return;
    }

    if (usuario.tipo === 'equipo') {
      navigate('/preguntas');
    } else if (usuario.tipo === 'admin') {
      navigate('/admin');
    }
  };

  return (
    <div className="form-login">
      <input
        type="text"
        placeholder="Nombre de usuario"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
      />
      <button onClick={manejarLogin}>Iniciar sesión</button>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export default Login;
