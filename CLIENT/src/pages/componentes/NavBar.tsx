import { Navbar, Nav, Button, ListGroup, Card } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../estilos/NavBar.css";
import { FaSignInAlt, FaTools } from "react-icons/fa";
import { useAuth } from "../AuthContext";

function MainNavbar() {
  const navigate = useNavigate();
  const { organizador, logout } = useAuth(); // ✅ contexto global
  const [open, setOpen] = useState(false);

  let organizadorUI = organizador;
  if (!organizadorUI) {
    try {
      const raw = localStorage.getItem("organizador");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed) {
          organizadorUI = {
            nome_organizador: parsed.nome_organizador || parsed.nome || parsed.username || "Organizador",
            foto_url: parsed.foto_url || parsed.foto_organizador || null,
            email: parsed.email,
            id: parsed.id,
          };
        }
      }
    } catch {
      organizadorUI = null;
    }
  }

  const handleLogout = () => {
    logout();      // borra sesión global
    navigate("/"); // redirixe a Home
    setOpen(false); // pecha o toggle
  };

  return (
    <Navbar expand="lg" className="main-navbar py-3">
      <div className="nav-container d-flex align-items-center justify-content-between">
        {/* Logo / Home */}
        <Navbar.Brand
          onClick={() => navigate("/")}
          className="site-name"
          style={{ cursor: "pointer" }}
        >
          eventospink
        </Navbar.Brand>

        <Nav className="ms-auto d-flex align-items-center position-relative">
          {organizadorUI && (
            <>
              {/* Foto do organizador */}
              <img
                src={organizadorUI.foto_url || "/default-avatar.png"}
                alt="Foto organizador"
                className="rounded-circle me-2"
                style={{ width: "38px", height: "38px", objectFit: "cover" }}
              />

              {/* Botón co nome */}
              <Button
                className="reserva-entrada-btn"
                onClick={() => setOpen(!open)}
              >
                {organizadorUI.nome_organizador}
              </Button>

              {/* Toggle menú */}
              {open && (
                <Card
                  className="toggle-card position-absolute mt-2 end-0"
                  style={{ zIndex: 1000 }} // garante que está encima doutros elementos
                >
                  <ListGroup variant="flush">
                    <ListGroup.Item
                      action
                      onClick={() => {
                        navigate("/panel-organizador");
                        setOpen(false);
                      }}
                    >
                      <FaTools style={{ marginRight: "8px" }} />
                      Panel de Xestión de Eventos
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={handleLogout}>
                      <FaSignInAlt style={{ marginRight: "8px" }} />
                      Cambiar idioma
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={handleLogout}>
                      <FaSignInAlt style={{ marginRight: "8px" }} />
                      Cambiar contrasinal
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={handleLogout}>
                      <FaSignInAlt style={{ marginRight: "8px" }} />
                      Actualizar a túa info
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={handleLogout}>
                      <FaSignInAlt style={{ marginRight: "8px" }} />
                      Elimina túa conta
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={handleLogout}>
                      <FaSignInAlt style={{ marginRight: "8px" }} />
                      Pechar Sesión
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              )}
            </>
          )}
        </Nav>
      </div>
    </Navbar>
  );
}

export default MainNavbar;