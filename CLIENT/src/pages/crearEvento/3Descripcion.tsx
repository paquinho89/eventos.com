import { Container, Card, Form, Button } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function Descripcion() {
  const navigate = useNavigate();
  const { evento, setEvento }: any = useOutletContext();

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card className="shadow-sm" style={{ maxWidth: "600px", width: "100%" }}>
        <Card.Body className="p-4">

          {/* Flecha de retroceso */}
          <div className="mb-3">
            <Button
              variant="link"
              className="p-0 text-decoration-none"
              onClick={() => navigate(-1)} // Volve ao paso anterior
            >
              ← Volver
            </Button>
          </div>

          <h3 className="text-center mb-2">Descrición do evento</h3>
          <p className="text-muted text-center mb-4">
            Describe o teu evento con detalle para que os asistentes coñezan que esperar.
          </p>

          <Form>
            <Form.Control
              as="textarea"
              placeholder="Ex: Un concerto ao aire libre con artistas locais..."
              value={evento.descripcion || ""}
              onChange={(e) =>
                setEvento({ ...evento, descripcion: e.target.value })
              }
              className="py-3 fs-5"
              rows={5}
              autoFocus
            />

            <Button
              className="mt-4 w-100"
              disabled={!evento.descripcion}
              onClick={() => navigate("/crear-evento/cartel")} // siguiente paso
            >
              Continuar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
