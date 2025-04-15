import { createContext, useState, useEffect, useRef } from 'react';

export const CronometroContext = createContext();

export const CronometroProvider = ({ children }) => {
    const [tiempo, setTiempo] = useState(0);
    const [activo, setActivo] = useState(false); // Cambiado de `null` a `false`
    const [usuarioEquipo, setUsuarioEquipo] = useState(null);
    const intervaloRef = useRef();

    // Función para iniciar el cronómetro
    const iniciarCronometro = (usuario) => {
        if (usuario?.tipo === 'equipo' && !activo) {
            setUsuarioEquipo(usuario);
            setActivo(true);
            localStorage.setItem('cronometroUsuario', JSON.stringify(usuario));
        }
    };

    // Función para detener el cronómetro
    const detenerCronometro = () => {
        clearInterval(intervaloRef.current);
        setActivo(false);
        setUsuarioEquipo(null);
        setTiempo(0);
        localStorage.removeItem('cronometroUsuario');
        localStorage.removeItem('cronometroTiempo');
    };

    // Efecto para manejar el intervalo del cronómetro
    useEffect(() => {
        if (activo) {
            intervaloRef.current = setInterval(() => {
                setTiempo((prev) => prev + 1);
            }, 1000);
        } else {
            clearInterval(intervaloRef.current);
        }
        return () => clearInterval(intervaloRef.current);
    }, [activo]); // Dependencia: `activo`

    // Efecto para sincronizar con localStorage al cargar
    useEffect(() => {
        const usuarioGuardado = localStorage.getItem('cronometroUsuario');
        const tiempoGuardado = localStorage.getItem('cronometroTiempo');

        if (usuarioGuardado) {
            setUsuarioEquipo(JSON.parse(usuarioGuardado));
            setTiempo(parseInt(tiempoGuardado) || 0);
            setActivo(true); // Activa el cronómetro si hay un usuario guardado
        }
    }, []);

    // Efecto para guardar el tiempo en localStorage cuando cambia
    useEffect(() => {
        if (activo) {
            localStorage.setItem('cronometroTiempo', tiempo);
        }
    }, [tiempo, activo]);

    return (
        <CronometroContext.Provider 
            value={{ tiempo, activo, usuarioEquipo, iniciarCronometro, detenerCronometro }}
        >
            {children}
        </CronometroContext.Provider>
    );
};