import { Container, Card, Form, Button, ListGroup } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";

declare global {
  interface Window {
    google: any;
  }
}

export default function Lugar() {
  const navigate = useNavigate();
  const { evento, setEvento }: any = useOutletContext();

  const [input, setInput] = useState(evento.lugar || "");
  const [predictions, setPredictions] = useState<any[]>([]);
  const [validSelection, setValidSelection] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    setValidSelection(false); // Cada vez que escriba, hai que volver seleccionar

    if (window.google && value.length > 2) {
      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        {
          input: value,
          types: ["geocode"], // Só suxerir enderezos reais
          componentRestrictions: { country: "ES" }, // opción, por exemplo España
        },
        (preds: any) => setPredictions(preds || [])
      );
    } else {
      setPredictions([]);
    }
  };

  const handleSelect = (place: string) => {
    setEvento({ ...evento, lugar: place });
    setInput(place);
    setPredictions([]);
    setValidSelection(true); // Marcamos que é unha selección válida
  };

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card className="shadow-sm" style={{ maxWidth: "600px", width: "100%" }}>
        <Card.Body className="p-4">
          {/* Flecha de retroceso */}
          <div className="mb-3">
            <Button
              variant="link"
              className="p-0 text-decoration-none"
              onClick={() => navigate(-1)}
            >
              ← Volver
            </Button>
          </div>

          <h3 className="text-center mb-2">Lugar do evento</h3>
          <p className="text-muted text-center mb-4">
            Escribe o nome do lugar e selecciona unha dirección válida.
          </p>

          <Form>
            <Form.Control
              type="text"
              placeholder="Ex: Plaza Mayor, Madrid"
              value={input}
              onChange={handleChange}
              autoFocus
            />

            {/* Lista de suxestións */}
            {predictions.length > 0 && (
              <ListGroup className="mt-2">
                {predictions.map((p) => (
                  <ListGroup.Item
                    key={p.place_id}
                    action
                    onClick={() => handleSelect(p.description)}
                  >
                    {p.description}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}

            <Button
              className="mt-4 w-100"
              disabled={!validSelection} // só activo se seleccionou unha suxestión válida
              onClick={() => navigate("/crear-evento/sala")}
            >
              Continuar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
