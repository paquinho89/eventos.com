import { Container, Card, Form, Button, Image } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useRef } from "react";

export default function Imagen() {
  const navigate = useNavigate();
  const { evento, setEvento }: any = useOutletContext();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEvento({ ...evento, imagen: file });
  };

  const handleRemoveImage = () => {
    setEvento({ ...evento, imagen: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
              <FaArrowLeft className="me-2" />
              Volver
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
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              <div
                className="form-control d-flex align-items-center p-0"
                style={{ overflow: "hidden", cursor: "pointer" }}
                onClick={() => fileInputRef.current?.click()}
              >
                <button
                  type="button"
                  className="btn btn-light rounded-0 border-0 border-end px-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Buscar
                </button>
                <span className="text-muted px-3 text-truncate" style={{ maxWidth: "100%" }}>
                  {evento.imagen ? evento.imagen.name : "Imaxen non seleccionada"}
                </span>
              </div>
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
                <div className="d-flex justify-content-between align-items-center mt-2" style={{ width: "100%" }}>
                  <p className="text-success m-0 text-start" style={{ maxWidth: "75%" }}>
                    📎 Imaxe seleccionada: {evento.imagen.name}
                  </p>
                  <button
                    type="button"
                    className="badge-prezo"
                    onClick={handleRemoveImage}
                  >
                    Eliminar imaxe
                  </button>
                </div>
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
