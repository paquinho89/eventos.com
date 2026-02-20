import { Container, Card, Form, Button } from "react-bootstrap";
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function Fecha() {
  const navigate = useNavigate();
  const { evento, setEvento }: any = useOutletContext();

  // Calculamos hoxe en formato yyyy-mm-dd
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, "0");
  const dd = String(hoy.getDate()).padStart(2, "0");
  const fechaMinima = `${yyyy}-${mm}-${dd}`;

  const [fecha, setFecha] = useState(evento.fecha);
  const [hora, setHora] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    
    if (!fecha) {
      setError("Selecciona unha data válida para o evento.");
      return;
    }
    setEvento({ ...evento, fecha });
    navigate("/crear-evento/lugar");
  };

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card className="shadow-sm" style={{ maxWidth: "600px", width: "100%" }}>
        <Card.Body className="p-4">
          <div className="mt-4 d-flex justify-content-between">
            <Button
              className="boton-avance"
              onClick={() => navigate(-1)}
            >
              ← Volver
            </Button>
            <Button
              className="reserva-entrada-btn"
              onClick={handleSubmit}
            >
              Continuar
            </Button>
          </div>
          <h3 className="text-center mb-3">Data do evento</h3>
          <Form>
          {/* Data */}
          <Form.Group className="mb-3">
            <Form.Label>Data</Form.Label>
            <Form.Control
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              min={fechaMinima}
            />
          </Form.Group>
          {/* Hora */}
          <Form.Group className="mb-3">
            <Form.Label>Hora</Form.Label>
            <Form.Control
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              step="60"
              lang="es-ES"
            />
          </Form.Group>
  {error && <div className="alert alert-danger mt-2">{error}</div>}

  <div className="mt-4 d-flex justify-content-end">
    <Button
      className="reserva-entrada-btn"
      onClick={handleSubmit}
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
