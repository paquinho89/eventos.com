import { Container, Button, Form, FormControl } from "react-bootstrap";
import MainNavbar from "./componentes/NavBar";
import CrearEventoBoton from "./componentes/CrearEventoBoton";
import ToggleHamburguer from "./componentes/Toggle";
import './Styles.css';


function Home() {
  return (
    <>
      <MainNavbar />
      
      {/* Botón flotante encima de la Navbar, derecha */}
      <div className="boton-flotante">
        <CrearEventoBoton />
      </div>

      <div>
        <ToggleHamburguer/>
      </div>

      {/* Hero / Buscador */}
      <Container className="text-center">
        <h1 className="mb-4">Encuentra tu próximo evento</h1>
        <Form className="d-flex justify-content-center">
          <FormControl
            type="search"
            placeholder="Buscar por nombre, tipo o lugar"
            className="me-2 w-50"
            aria-label="Search"
          />
          <Button variant="primary">Buscar</Button>
        </Form>
      </Container>
    </>
  );
}

export default Home;
