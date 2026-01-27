import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateEvent from './pages/CrearEvento';
import PanelOrganizador from './PanelControlOrganizador';
import VerificacionEmailPage from './pages/componentes/2ConfirmacionEmail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="crear-evento" element={<CreateEvent />} />
        <Route path="panel-organizador" element={<PanelOrganizador />} />
        <Route path="/verificacion/:uid/:token" element={<VerificacionEmailPage />} />
      </Routes>
    </Router>
  );
}

export default App
