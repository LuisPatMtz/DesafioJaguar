import React, { useState, useEffect, useRef } from "react";

const useCronometro = () => {
    const [tiempo, setTiempo] = useState(0);
    const [activo, setActivo] = useState(false);
    const [vueltas, setVueltas] = useState([]);
    const [vueltasGuardadas, setVueltasGuardadas] = useState([]); // Nuevo estado para almacenar vueltas
    const intervaloRef = useRef(null);

    const formatearTiempo = (milisegundos) => {
        const horas = Math.floor(milisegundos / 3600000);
        const minutos = Math.floor((milisegundos % 3600000) / 60000);
        const segundos = Math.floor((milisegundos % 60000) / 1000);
        const ms = Math.floor(milisegundos % 1000).toString().padStart(3, '0').slice(0, 2); // Mostramos 2 dígitos de ms

        return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}:${ms}`;
    };

    const iniciar = () => {
        if (!activo) {
            intervaloRef.current = setInterval(() => {
                setTiempo((prevTiempo) => prevTiempo + 1);
            }, 1000);
            setActivo(true);
        }
    };

    const pausar = () => {
        if (activo) {
            clearInterval(intervaloRef.current);
            setActivo(false);
        }
    };

    const reiniciar = () => {
        // Guarda las vueltas actuales antes de reiniciar
        setVueltasGuardadas(vueltas); // 👈 Aquí se almacenan
        clearInterval(intervaloRef.current);
        setTiempo(0);
        setActivo(false);
        setVueltas([]); // Reinicia las vueltas activas
    };

    const guardarVuelta = () => {
        if (activo) {
            setVueltas([...vueltas, formatearTiempo(tiempo)]);
        }
    };

    return {
        tiempo: formatearTiempo(tiempo),
        iniciar,
        pausar,
        reiniciar,
        guardarVuelta,
        vueltas: vueltas.map((vuelta, index) => (
            <li key={index}>{vuelta}</li>
        )),
        vueltasGuardadas: vueltasGuardadas.map((vuelta, index) => (
            <li key={index}>{vuelta}</li>
        ))
    };
};

export default useCronometro;