import { useContext, useMemo } from 'react';
import { CronometroContext } from './CronometroContext';
import './Cronometro.css'; // Asegúrate de tener estilos para la clase .cronometro-container y .timer-card

function CronometroAdmin() {
    const { cronometros } = useContext(CronometroContext);

    const cronometrosActivos = useMemo(() => {
        return Object.entries(cronometros)
            .filter(([key, cronometro]) => (
                cronometro && 
                key !== "null" && 
                cronometro.activo === true
            ))
            .map(([usuarioId, cronometro]) => ({
                usuarioId,
                nombre: cronometro.nombre || cronometro.usuario || `Equipo ${usuarioId}`,
                tiempo: cronometro.tiempo || 0
            }));
    }, [cronometros]);

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (cronometrosActivos.length === 0) {
        return (
            <div className="no-timers-message">
                No hay cronómetros activos
            </div>
        );
    }

    return (
        <div className="cronometro-container">
            {cronometrosActivos.map((cronometro) => (
                <div key={cronometro.usuarioId} className="timer-card">
                    <h4>Sesión activa</h4>
                    <p>Equipo: {cronometro.nombre}</p>
                    <p>Tiempo: {formatTime(cronometro.tiempo)}</p>
                </div>
            ))}
        </div>
    );
}

export default CronometroAdmin;