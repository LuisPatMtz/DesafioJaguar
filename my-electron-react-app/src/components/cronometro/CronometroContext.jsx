import { createContext, useState, useEffect, useRef, useMemo } from 'react';

// Crear el contexto
const CronometroContext = createContext();

// Proveedor del contexto
export function CronometroProvider({ children }) {
    const [cronometros, setCronometros] = useState({});
    const intervalosRef = useRef({});

    // Cargar cronómetros guardados al iniciar
    useEffect(() => {
        const guardados = JSON.parse(localStorage.getItem('cronometros') || '{}');
        const cronometrosValidos = {};
        
        Object.entries(guardados).forEach(([id, data]) => {
            if (data && typeof data.tiempo === 'number' && data.usuario) {
                cronometrosValidos[id] = data;
            }
        });
        
        setCronometros(cronometrosValidos);
    }, []);

const acciones = {
    iniciarCronometro: (usuarioId, nombreUsuario) => {
        console.log('Intentando iniciar cronómetro para:', usuarioId, 'con nombre:', nombreUsuario);
        
        setCronometros(prev => {
            // Si ya existe y está activo, no hacer nada
            if (prev[usuarioId]?.activo) {
                console.log('Cronómetro ya activo para:', usuarioId);
                return prev;
            }
            
            // Crear nuevo estado
            const nuevoEstado = {
                ...prev,
                [usuarioId]: {
                    tiempo: prev[usuarioId]?.tiempo || 0,
                    activo: true,
                    nombre: nombreUsuario || prev[usuarioId]?.nombre || `Equipo ${usuarioId}`,
                    usuario: nombreUsuario || prev[usuarioId]?.usuario || usuarioId // Mantener compatibilidad
                }
            };
            
            // Eliminar entrada "null" si existe
            if (nuevoEstado.null) {
                delete nuevoEstado.null;
            }
            
            // Guardar en localStorage
            localStorage.setItem('cronometros', JSON.stringify(nuevoEstado));
            console.log('Nuevo estado guardado:', nuevoEstado);
            
            return nuevoEstado;
        });
    },
    
    detenerCronometro: (usuarioId) => {
        setCronometros(prev => {
            if (!prev[usuarioId]) return prev;
            
            const nuevoEstado = {
                ...prev,
                [usuarioId]: {
                    ...prev[usuarioId],
                    activo: false
                }
            };
            
            clearInterval(intervalosRef.current[usuarioId]);
            delete intervalosRef.current[usuarioId];
            
            localStorage.setItem('cronometros', JSON.stringify(nuevoEstado));
            return nuevoEstado;
        });
    }
};

// No necesitas useMemo si no hay dependencias externas que cambien

    // Efecto para manejar los intervalos
    useEffect(() => {
        // Primero limpia todos los intervalos existentes
        Object.values(intervalosRef.current).forEach(intervalo => {
            clearInterval(intervalo);
        });
        intervalosRef.current = {}; // Resetear el objeto de referencias
    
        // Luego crear nuevos intervalos para los cronómetros activos
        Object.entries(cronometros).forEach(([usuarioId, cronometro]) => {
            if (cronometro.activo) {
                intervalosRef.current[usuarioId] = setInterval(() => {
                    setCronometros(prev => {
                        // Verificar si el cronómetro sigue activo
                        if (!prev[usuarioId]?.activo) return prev;
                        
                        const nuevoTiempo = prev[usuarioId].tiempo + 1;
                        
                        // Actualizar localStorage
                        const guardados = JSON.parse(localStorage.getItem('cronometros') || '{}');
                        guardados[usuarioId] = {
                            ...guardados[usuarioId],
                            tiempo: nuevoTiempo
                        };
                        localStorage.setItem('cronometros', JSON.stringify(guardados));
    
                        return {
                            ...prev,
                            [usuarioId]: {
                                ...prev[usuarioId],
                                tiempo: nuevoTiempo
                            }
                        };
                    });
                }, 1000);
            }
        });
    
        return () => {
            // Limpieza al desmontar
            Object.values(intervalosRef.current).forEach(intervalo => {
                clearInterval(intervalo);
            });
        };
    }, [cronometros]);

    const valor = useMemo(() => ({
        cronometros,
        ...acciones
    }), [cronometros]);

    return (
        <CronometroContext.Provider value={valor}>
            {children}
        </CronometroContext.Provider>
    );
}

// Exportar el contexto y el proveedor
export { CronometroContext };