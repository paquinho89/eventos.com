import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateEvent from './pages/CrearEventoELIMINAR';
import PanelOrganizador from './PanelControlOrganizador';
import VerificacionEmailPage from './pages/componentes/2ConfirmacionEmail';
import IntroducirNuevaContraseña from './pages/componentes/IntroducirNuevaContraseña';
import { CreateEventLayout } from './pages/crearEvento/0ElememtoPadre';
import TipoEvento from './pages/crearEvento/1TipoEvento';
import TituloEvento from './pages/crearEvento/2TituloEvento';
import Descripcion from './pages/crearEvento/3Descripcion';
import Imagen from './pages/crearEvento/4Imagen';
import Fecha from './pages/crearEvento/5Fecha';
import Lugar from './pages/crearEvento/6Lugar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="crear-evento-orixinal" element={<CreateEvent />} />
        <Route path="panel-organizador" element={<PanelOrganizador />} />
        <Route path="/verificacion/:uid/:token" element={<VerificacionEmailPage />} />
        <Route path="/reset-password/:uid/:token" element={<IntroducirNuevaContraseña />} />
        <Route path="crear-evento" element={<CreateEventLayout />}>
          <Route path="/crear-evento/tipo" element={<TipoEvento />} />
          <Route path="/crear-evento/titulo" element={<TituloEvento />} />
          <Route path="/crear-evento/descripcion" element={<Descripcion />} />
          <Route path="/crear-evento/cartel" element={<Imagen />} />
          <Route path="/crear-evento/fecha" element={<Fecha />} />
          <Route path="/crear-evento/lugar" element={<Lugar />} />
          
        </Route>
      </Routes>
    </Router>
  );
}

export default App
