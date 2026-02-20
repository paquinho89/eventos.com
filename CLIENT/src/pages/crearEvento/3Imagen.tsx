import { Container, Card, Form, Button, Image } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";

export default function Imagen() {
  const navigate = useNavigate();
  const { evento, setEvento }: any = useOutletContext();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEvento({ ...evento, imagen: file });
  };

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card className="shadow-sm" style={{ maxWidth: "600px", width: "100%" }}>
        <Card.Body className="p-4">

          {/* Flecha de retroceso */}
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <Button
              className="boton-avance"
              onClick={() => navigate(-1)}
            >
              ← Volver
            </Button>
            <Button
              className="reserva-entrada-btn"
              onClick={() => navigate("/crear-evento/fecha")}
            >
              Continuar
            </Button>
          </div>

          <h3 className="text-center mb-2">Cartel ou imaxe do evento</h3>
          <p className="text-muted text-center mb-4">
            Sube unha imaxe atractiva para promocionar o teu evento.
          </p>

          <Form>
            <Form.Group className="mb-3">
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Form.Group>

            {/* ✅ Previsualización persistente */}
            {evento.imagen && (
              <div className="text-center mb-3">
                <Image
                  src={URL.createObjectURL(evento.imagen)}
                  alt="Previsualización"
                  fluid
                  rounded
                  style={{
                    maxHeight: 300,
                    objectFit: "cover",
                  }}
                />
                <p className="text-success mt-2">
                  📎 Imaxe seleccionada: {evento.imagen.name}
                </p>
              </div>
            )}
            <div className="d-flex justify-content-end mt-4">
              <Button
                className="reserva-entrada-btn"
                onClick={() => navigate("/crear-evento/fecha")}
              >
                Continuar
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
