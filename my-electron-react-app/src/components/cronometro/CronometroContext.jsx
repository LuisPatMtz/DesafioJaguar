import { createContext, useState, useEffect, useRef } from 'react';

export const CronometroContext = createContext();

export const CronometroProvider = ({ children }) => {
    const [cronometros, setCronometros] = useState({});
    const intervalosRef = useRef({});

    // Cargar cronómetros guardados al iniciar
    useEffect(() => {
        const guardados = JSON.parse(localStorage.getItem('cronometros') || '{}');
        // Solo cargar los que tienen datos válidos
        const cronometrosValidos = {};
        Object.entries(guardados).forEach(([id, data]) => {
            if (data && typeof data.tiempo === 'number' && data.usuario) {
                cronometrosValidos[id] = data;
            }
        });
        setCronometros(cronometrosValidos);
    }, []);

    // Función para iniciar un cronómetro
    const iniciarCronometro = (usuarioId, nombreUsuario) => {
        setCronometros(prev => {
            // Si ya existe y está activo, no hacer nada
            if (prev[usuarioId]?.activo) return prev;
            
            return {
                ...prev,
                [usuarioId]: {
                    tiempo: prev[usuarioId]?.tiempo || 0,
                    activo: true,
                    nombre: nombreUsuario || prev[usuarioId]?.nombre || usuarioId
                }
            };
        });

        // Guardar en localStorage
        const cronometrosGuardados = JSON.parse(localStorage.getItem('cronometros') || '{}');
        cronometrosGuardados[usuarioId] = {
            tiempo: cronometrosGuardados[usuarioId]?.tiempo || 0,
            activo: true,
            nombre: nombreUsuario || cronometrosGuardados[usuarioId]?.nombre || usuarioId
        };
        localStorage.setItem('cronometros', JSON.stringify(cronometrosGuardados));
    };

    // Función para detener un cronómetro
    const detenerCronometro = (usuarioId) => {
        setCronometros(prev => {
            if (!prev[usuarioId]) return prev;
            
            return {
                ...prev,
                [usuarioId]: {
                    ...prev[usuarioId],
                    activo: false
                }
            };
        });

        // Limpiar intervalo
        if (intervalosRef.current[usuarioId]) {
            clearInterval(intervalosRef.current[usuarioId]);
            delete intervalosRef.current[usuarioId];
        }

        // Actualizar localStorage
        const cronometrosGuardados = JSON.parse(localStorage.getItem('cronometros') || '{}');
        if (cronometrosGuardados[usuarioId]) {
            cronometrosGuardados[usuarioId].activo = false;
            localStorage.setItem('cronometros', JSON.stringify(cronometrosGuardados));
        }
    };

    // Efecto para manejar los intervalos
    useEffect(() => {
        // Iniciar intervalos para los activos
        Object.entries(cronometros).forEach(([usuarioId, cronometro]) => {
            if (cronometro.activo && !intervalosRef.current[usuarioId]) {
                intervalosRef.current[usuarioId] = setInterval(() => {
                    setCronometros(prev => ({
                        ...prev,
                        [usuarioId]: {
                            ...prev[usuarioId],
                            tiempo: prev[usuarioId].tiempo + 1
                        }
                    }));

                    // Actualizar localStorage cada segundo
                    const guardados = JSON.parse(localStorage.getItem('cronometros') || '{}');
                    if (guardados[usuarioId]) {
                        guardados[usuarioId].tiempo += 1;
                        localStorage.setItem('cronometros', JSON.stringify(guardados));
                    }
                }, 1000);
            }
        });

        // Limpieza
        return () => {
            Object.entries(intervalosRef.current).forEach(([usuarioId, intervalo]) => {
                clearInterval(intervalo);
            });
        };
    }, [cronometros]);

    return (
        <CronometroContext.Provider value={{ cronometros, iniciarCronometro, detenerCronometro }}>
            {children}
        </CronometroContext.Provider>
    );
};