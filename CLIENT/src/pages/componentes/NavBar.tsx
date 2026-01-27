import { Navbar, Container, Nav } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function MainNavbar() {
  const navigate = useNavigate();

  const [organizador, setOrganizador] = useState<{ nome_organizador: string } | null>(null);

  // Ler localStorage ao cargar o componente
  useEffect(() => {
    const organizadorRaw = localStorage.getItem("organizador");
    if (organizadorRaw) {
      setOrganizador(JSON.parse(organizadorRaw));
    }
  }, []);

    const handleLogout = () => {
      localStorage.removeItem("organizador"); // Limpar token
      setOrganizador(null);                    // Actualizar UI
      navigate("/");                            // Redireccionar sen recargar
    };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand href="/">Eventos.com</Navbar.Brand>
        <Nav className="ms-auto">
          {organizador ? (
            <>
              <Nav.Item className="d-flex align-items-center me-3">
                👋 Ola, <strong className="ms-1">{organizador.nome_organizador}</strong>
              </Nav.Item>
              <Nav.Link onClick={handleLogout}>
                Pechar sesión
              </Nav.Link>
            </>
          ) : (
            <Nav.Link href="/login">Iniciar sesión</Nav.Link>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default MainNavbar;
