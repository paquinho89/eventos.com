import { Navbar, Nav, Form, FormControl, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../estilos/NavBar.css";

function MainNavbar() {
  const navigate = useNavigate();

  interface OrganizadorType {
    nome_organizador: string;
    foto_url?: string | null;
    email?: string;
    id?: number;
  }
  const [organizador, setOrganizador] = useState<OrganizadorType | null>(null);
  const [query, setQuery] = useState("");

  // Ler localStorage ao cargar o componente
  useEffect(() => {
    const organizadorRaw = localStorage.getItem("organizador");
    if (organizadorRaw) {
      setOrganizador(JSON.parse(organizadorRaw));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("organizador");
    setOrganizador(null);
    navigate("/");
  };

  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navegar á home con query como parámetro de búsqueda
    const q = query.trim();
    if (q.length > 0) {
      navigate(`/?q=${encodeURIComponent(q)}`);
    } else {
      navigate("/");
    }
  };

  return (
    <Navbar expand="lg" className="main-navbar py-3">
      <div className="nav-container d-flex align-items-center">
        <Navbar.Brand onClick={() => navigate("/")} className="site-name" style={{ cursor: "pointer" }}>
          eventospink
        </Navbar.Brand>

        <Nav className="ms-auto d-flex align-items-center gap-2">
          {/* Search para pantallas pequeñas */}
          <Form className="d-flex d-lg-none me-2" onSubmit={handleSubmitSearch}>
            <FormControl
              placeholder="Buscar"
              aria-label="Buscar"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="me-2 navbar-search-input"
              style={{ width: "160px" }}
            />
          </Form>

          {organizador && (
            <>
            <img
                  src={organizador.foto_url || "/default-avatar.png"}
                  alt="Foto organizador"
                  className="rounded-circle me-2"
                  style={{
                    width: "38px",
                    height: "38px",
                    objectFit: "cover",
                  }}
                />
              <Button
                className="reserva-entrada-btn"
                onClick={handleLogout}
              >
                <div className="d-flex align-items-center">
                <div>
                  <span>
                    {organizador.nome_organizador}
                  </span>
                </div>
              </div>
              </Button>
            </>
          )}
        </Nav>
      </div>
    </Navbar>
  );
}

export default MainNavbar;
