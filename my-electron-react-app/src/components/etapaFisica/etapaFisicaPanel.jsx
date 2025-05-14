// src/components/etapaFisica/etapaFisicaPanel.jsx
import React from 'react';
import './etapaFisicaPanel.css';

export default function EtapaFisicaPanel({ teamId }) {
  return (
    <div className="etapa-fisica-panel">
      <h2 className="etapa-fisica-panel__title">Etapa Física</h2>
      <p className="etapa-fisica-panel__subtitle">
        ¡Listos para la siguiente fase, equipo {teamId}!
      </p>
      <div className="etapa-fisica-panel__content">
        {/* Aquí va el contenido específico de la prueba física */}
        <p>En breve comenzará la prueba física. ¡Prepárate!</p>
      </div>
    </div>
  );
}
