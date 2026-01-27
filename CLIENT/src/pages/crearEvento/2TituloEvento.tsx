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
              value={evento.titulo || ""}
              onChange={(e) =>
                setEvento({ ...evento, titulo: e.target.value })
              }
              className="py-3 fs-5"
              autoFocus
            />

            <Button
              className="mt-4 w-100"
              disabled={!evento.titulo}
              onClick={() => navigate("/crear-evento/descripcion")}
            >
              Continuar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
