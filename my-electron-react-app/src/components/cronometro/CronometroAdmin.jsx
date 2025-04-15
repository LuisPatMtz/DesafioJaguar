import { useContext, useEffect } from 'react';
import { CronometroContext } from './CronometroContext';

function CronometroAdmin() {
    const { tiempo, activo, usuarioEquipo } = useContext(CronometroContext); // Eliminamos setUsuarioEquipo (no es necesario aquí)
    
    useEffect(() => {
        // Sincroniza el usuario desde localStorage (solo una vez al montar)
        const usuario = localStorage.getItem('cronometroUsuario');
        if (usuario) {
            try {
                const parsedUsuario = JSON.parse(usuario);
                if (parsedUsuario?.tipo === 'equipo') {
                    // No necesitamos setUsuarioEquipo, ya el contexto lo maneja
                }
            } catch (error) {
                console.error('Error al parsear usuario:', error);
            }
        }
    }, []); // Dependencia vacía: se ejecuta solo al montar

    if (!activo) return null;

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: 'black',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            zIndex: 1000
        }}>
            <h4>Sesión de equipo activa</h4>
            <p>Usuario: {usuarioEquipo?.nombre || 'No asignado'}</p> {/* Manejo de caso undefined */}
            <p>Tiempo: {formatTime(tiempo)}</p>
        </div>
    );
}

export default CronometroAdmin;