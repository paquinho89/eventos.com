import { Container, Card, Form, Button } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function TituloEvento() {
  const navigate = useNavigate();
  const { evento, setEvento }: any = useOutletContext();

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card
        className="shadow-sm"
        style={{ maxWidth: "520px", width: "100%" }}
      >
        <Card.Body className="p-4">
            <div className="mb-3">
            <Button
                variant="link"
                className="p-0 text-decoration-none"
                onClick={() => navigate(-1)} // Volve ao paso anterior
            >
                ← Volver
            </Button>
          </div>
          <h3 className="text-center mb-2">Título do evento</h3>
          <p className="text-muted text-center mb-4">
            Escolle un nome claro e atractivo
          </p>

          <Form>
            <Form.Control
              type="text"
              placeholder="Ex: Concerto de primavera 2026"
              onChange={(e) =>
                setEvento({ ...evento, titulo: e.target.value })
              }
              className="py-3 fs-5"
              autoFocus
            />
          </Form>
        
          {/* Flecha de retroceso */}
          <h3 className="text-center mb-2">Descrición do evento</h3>
          <p className="text-muted text-center mb-4">
            Describe o teu evento con detalle para que os asistentes coñezan que esperar.
          </p>

          <Form>
            <Form.Control
              as="textarea"
              placeholder="Ex: Un concerto ao aire libre con artistas locais..."
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
