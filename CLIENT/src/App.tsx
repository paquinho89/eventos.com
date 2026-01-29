import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateEvent from './pages/CrearEventoELIMINAR';
import PanelOrganizador from './PanelControlOrganizador';
import VerificacionEmailPage from './pages/componentes/2ConfirmacionEmail';
import IntroducirNuevaContraseña from './pages/componentes/IntroducirNuevaContraseña';
import { CreateEventLayout } from './pages/crearEvento/0ElememtoPadre';
import TipoEvento from './pages/crearEvento/1TipoEvento';
import TituloEvento from './pages/crearEvento/2TituloEventoDescripcion';
import Imagen from './pages/crearEvento/3Imagen';
import Fecha from './pages/crearEvento/4Fecha';
import Lugar from './pages/crearEvento/5LugarProbas';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="crear-evento-orixinal" element={<CreateEvent />} />
        <Route path="panel-organizador" element={<PanelOrganizador />} />
        <Route path="verificacion/:uid/:token" element={<VerificacionEmailPage />} />
        <Route path="reset-password/:uid/:token" element={<IntroducirNuevaContraseña />} />
        <Route path="crear-evento" element={<CreateEventLayout />}>
          <Route path="tipo" element={<TipoEvento />} />
          <Route path="titulo" element={<TituloEvento />} />
          <Route path="cartel" element={<Imagen />} />
          <Route path="fecha" element={<Fecha />} />
          <Route path="lugar" element={<Lugar />} />
          
        </Route>
      </Routes>
    </Router>
  );
}

export default App
