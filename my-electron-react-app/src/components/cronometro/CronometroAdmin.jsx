import { useContext, useMemo } from 'react';
import { CronometroContext } from './CronometroContext';

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

    // Definición de estilos
    const styles = {
        container: {
            position: 'fixed',
            top: '20px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            zIndex: 1000
        },
        timerCard: {
            backgroundColor: '#1890ff',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            minWidth: '250px'
        },
        noTimersMessage: {
            backgroundColor: 'lightgray',
            padding: '10px',
            borderRadius: '5px'
        }
    };

    if (cronometrosActivos.length === 0) {
        return (
            <div style={styles.noTimersMessage}>
                No hay cronómetros activos
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {cronometrosActivos.map((cronometro) => (
                <div key={cronometro.usuarioId} style={styles.timerCard}>
                    <h4>Sesión activa</h4>
                    <p>Equipo: {cronometro.nombre}</p>
                    <p>Tiempo: {formatTime(cronometro.tiempo)}</p>
                </div>
            ))}
        </div>
    );
}

export default CronometroAdmin;