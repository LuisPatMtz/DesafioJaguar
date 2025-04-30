import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  const manejarLogin = async () => {
    setError('');

    try {
      const response = await fetch('https://v62mxrdy3g.execute-api.us-east-1.amazonaws.com/prod/loginRDS', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: nombre,
          contrasena: contrasena,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al iniciar sesión');
        return;
      }

      localStorage.setItem('id_usuario', data.id_usuario);
      localStorage.setItem('nombre', data.nombre);

      if (data.redirect === '/panel-admin') {
        navigate('/panel-admin');
      } else {
        // Si más adelante usas el cronómetro, descomenta esta línea
        // Cronometro.iniciar();
        navigate(`/equipo-panel/${data.id_usuario}`);
      }

    } catch (err) {
      setError('Error al conectar con el servidor');
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
