import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AdminPage from './pages/AdminPage'
import EquipoPanel from './pages/EquipoPanel'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/panel-admin" element={<AdminPage />} />
        <Route path="/equipo-panel/:id" element={<EquipoPanel />} />
      </Routes>
    </Router>
  )
}

export default App
