import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import MainNavbar from "./componentes/NavBar";

function CreateEvent() {
  return (
    <>
    <MainNavbar />
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="mb-4 text-center">Crear evento</h2>

              <Form>
                {/* Nome evento */}
                <Form.Group className="mb-3">
                  <Form.Label>Nome do evento</Form.Label>
                  <Form.Control type="text" placeholder="Introduce o nome do evento" />
                </Form.Group>

                {/* Tipo evento */}
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de evento</Form.Label>
                  <Form.Control type="text" placeholder="Concerto, conferencia, teatro..." />
                </Form.Group>

                {/* Lugar */}
                <Form.Group className="mb-3">
                  <Form.Label>Lugar</Form.Label>
                  <Form.Control type="text" placeholder="Cidade ou recinto" />
                </Form.Group>

                {/* Sala */}
                <Form.Group className="mb-3">
                  <Form.Label>Sala</Form.Label>
                  <Form.Control type="text" placeholder="Sala (opcional)" />
                </Form.Group>

                {/* Precio */}
                <Form.Group className="mb-3">
                  <Form.Label>Prezo (€)</Form.Label>
                  <Form.Control type="number" step="0.01" placeholder="0.00" />
                </Form.Group>

                {/* Imagen cartel */}
                <Form.Group className="mb-3">
                  <Form.Label>Cartel do evento</Form.Label>
                  <Form.Control type="file" accept="image/*" />
                </Form.Group>

                {/* Fecha */}
                <Form.Group className="mb-4">
                  <Form.Label>Data do evento</Form.Label>
                  <Form.Control type="date" />
                </Form.Group>

                {/* Número de Conta para Ingresar os cartos */}
                <Form.Group className="mb-4">
                  <Form.Label>Número de Cuenta</Form.Label>
                  <Form.Control type="number" step="0.01" placeholder="0.00" />
                </Form.Group>

                <div className="d-grid">
                  <Button variant="primary" type="submit">
                    Crear evento
                  </Button>
                </div>
              </Form>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </>
  );
}

export default CreateEvent;
