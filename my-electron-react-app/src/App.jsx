import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Preguntas from './pages/Preguntas';
import { CronometroProvider } from './components/cronometro/CronometroContext';

function App() {
  return (
  <CronometroProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path ="/admin" element={<Admin />} />
        <Route path="/preguntas" element={<Preguntas />} />
      </Routes>
    </BrowserRouter>
  </CronometroProvider>
  );
}

export default App;
