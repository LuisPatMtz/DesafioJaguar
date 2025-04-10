import React, { useState, useEffect, useRef } from "react";

const Cronometro = () => {
    const [tiempo, setTiempo] = useState(0);
    const [activo, setActivo] = useState(false);
    const [vueltas, setVueltas] = useState([]);
    const intervaloRef = useRef(null);

    // Función para formatear el tiempo en HH:MM:SS
    const formatearTiempo = (segundos) => {
        const horas = Math.floor(segundos / 3600);
        const minutos = Math.floor((segundos % 3600) / 60);
        const segs = segundos % 60;
        return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
    };

    // Iniciar el cronómetro
    const iniciar = () => {
        if (!activo) {
            intervaloRef.current = setInterval(() => {
                setTiempo((prevTiempo) => prevTiempo + 1);
            }, 1000);
            setActivo(true);
        }
    };

    // Pausar el cronómetro
    const pausar = () => {
        if (activo) {
            clearInterval(intervaloRef.current);
            setActivo(false);
        }
    };

    // Reiniciar el cronómetro
    const reiniciar = () => {
        clearInterval(intervaloRef.current);
        setTiempo(0);
        setActivo(false);
        setVueltas([]);
    };

    // Guardar una vuelta (marcador de tiempo)
    const guardarVuelta = () => {
        if (activo) {
            setVueltas([...vueltas, formatearTiempo(tiempo)]);
        }
    };

    // Limpiar el intervalo al desmontar el componente
    useEffect(() => {
        return () => {
            if (intervaloRef.current) clearInterval(intervaloRef.current);
        };
    }, []);
    return{
        iniciar,
        pausar,
        reiniciar,
        guardarVuelta,
    };
};

export default Cronometro;