import { Container, Card, Form, Button, Image } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";

export default function Imagen() {
  const navigate = useNavigate();
  const { evento, setEvento }: any = useOutletContext();
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEvento({ ...evento, imagen: file });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
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

          <h3 className="text-center mb-2">Cartel do evento</h3>
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

            {/* Previsualización */}
            {preview && (
              <div className="text-center mb-3">
                <Image src={preview} alt="Previsualización" fluid rounded />
              </div>
            )}

            <Button
              className="mt-2 w-100"
              disabled={!evento.imagen}
              onClick={() => navigate("/crear-evento/fecha")} // Siguiente paso
            >
              Continuar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
