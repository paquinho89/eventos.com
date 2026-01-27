import { Container, Card, Row, Col } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";

const TIPOS_EVENTO = [
  "Concerto",
  "Obra de Teatro",
  "Musical",
  "Monólogo",
  "Coloquio",
  "Certamen",
  "Comida/Cena Popular",
  "Festa Popular",
  "Festival",
  "Outros",
];

export default function TipoEvento() {
  const navigate = useNavigate();
  const { evento, setEvento }: any = useOutletContext();

  const seleccionarTipo = (tipo: string) => {
    setEvento({ ...evento, tipo });
    navigate("/crear-evento/titulo"); // seguinte paso
  };

  return (
    <Container className="py-5">
      <h3 className="text-center mb-4">Que tipo de evento vas crear?</h3>

      <Row className="g-4">
        {TIPOS_EVENTO.map((tipo) => (
          <Col md={4} sm={6} xs={12} key={tipo}>
            <Card
              className={`h-100 text-center shadow-sm tipo-card ${
                evento.tipo === tipo ? "border-primary" : ""
              }`}
              style={{
                cursor: "pointer",
                minHeight: "120px",
                display: "flex",
                justifyContent: "center",
              }}
              onClick={() => seleccionarTipo(tipo)}
            >
              <Card.Body className="d-flex align-items-center justify-content-center">
                <h5 className="mb-0">{tipo}</h5>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
