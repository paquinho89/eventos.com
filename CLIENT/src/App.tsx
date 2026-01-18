import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateEvent from './pages/CrearEvento';
import PanelOrganizador from './PanelControlOrganizador';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="crear-evento" element={<CreateEvent />} />
        <Route path="panel-organizador" element={<PanelOrganizador />} />
      </Routes>
    </Router>
  );
}

export default App
