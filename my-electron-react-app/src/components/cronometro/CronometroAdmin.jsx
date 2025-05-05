import { useContext, useEffect, useState } from 'react';
import { CronometroContext } from './CronometroContext';

function CronometroAdmin() {
    const { cronometros } = useContext(CronometroContext);
    const [cronometrosActivos, setCronometrosActivos] = useState([]);

    // Efecto para transformar los cronómetros a un array y filtrar los activos
    useEffect(() => {
        const cronometrosArray = Object.entries(cronometros)
            .filter(([_, cronometro]) => cronometro.activo)
            .map(([usuarioId, cronometro]) => ({
                usuarioId,
                ...cronometro
            }));

        setCronometrosActivos(cronometrosArray);
    }, [cronometros]);

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (cronometrosActivos.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            zIndex: 1000
        }}>
            {cronometrosActivos.map((cronometro) => (
                <div key={cronometro.usuarioId} style={{
                    backgroundColor: 'skyblue',
                    padding: '10px',
                    borderRadius: '5px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                }}>
                    <h4>Sesión de equipo activa</h4>
                    <p>Usuario: {cronometro.usuario?.nombre || 'No asignado'}</p>
                    <p>Tiempo: {formatTime(cronometro.tiempo)}</p>
                </div>
            ))}
        </div>
    );
}

export default CronometroAdmin;