import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import RelojElectronico from './Componentes/reloj/reloj'
import Cronometro from './Componentes/cronometro/cronometro'

function App() {
  return (
    <div className="App">
      <RelojElectronico />
      <Cronometro />
    </div>
  );
}

export default App;
