import { useState } from "react";
import { Button, Card, ListGroup } from "react-bootstrap";

function PanelOrganizador() {
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen(prev => !prev);

  return (
    <>
      <h1>panel de control organizador</h1>
      <div style={{ position: "relative" }}>
        {/* Botón de engranaje */}
        <Button
          onClick={handleToggle}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#ff385c",
            border: "none",
            color: "white",
          }}
        >
          ⚙️
        </Button>

        {/* Menú desplegable */}
        {open && (
          <Card
            style={{
              position: "absolute",
              top: "50px",
              right: 0,
              width: "200px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              zIndex: 1000,
            }}
          >
            <ListGroup variant="flush">
              <ListGroup.Item action onClick={() => alert("Cambio de contraseña")}>
                Cambio de contraseña
              </ListGroup.Item>
              <ListGroup.Item action onClick={() => alert("Idioma")}>
                Idioma
              </ListGroup.Item>
              <ListGroup.Item action onClick={() => alert("Eliminar cuenta")}>
                Eliminar cuenta
              </ListGroup.Item>
            </ListGroup>
          </Card>
        )}
      </div>
    </>
  );
}

export default PanelOrganizador;
