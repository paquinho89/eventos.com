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

  const [fecha, setFecha] = useState(evento.fecha || fechaMinima);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!fecha) {
      setError("Selecciona a data do evento");
      return;
    }
    setEvento({ ...evento, fecha });
    navigate("/crear-evento/lugar"); // exemplo: seguinte paso
  };

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card className="shadow-sm" style={{ maxWidth: "600px", width: "100%" }}>
        <Card.Body className="p-4">
          <div className="mb-3">
            <Button
              variant="link"
              className="p-0 text-decoration-none"
              onClick={() => navigate(-1)}
            >
              ← Volver
            </Button>
          </div>

          <h3 className="text-center mb-3">Data do evento</h3>
          <p className="text-muted text-center mb-4">
            Selecciona a data do evento (non se poden poñer datas pasadas)
          </p>

          <Form>
            <Form.Control
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              min={fechaMinima} // ✅ evita datas pasadas
            />

            {error && <div className="alert alert-danger mt-2">{error}</div>}

            <Button className="mt-4 w-100" onClick={handleSubmit}>
              Continuar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
