import React, { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Button, Container, Card, Alert } from "react-bootstrap";
import type { OutletContext } from "../crearEvento/0ElementoPadre";

const Resumen: React.FC = () => {
  const { evento, setEvento } = useOutletContext<OutletContext>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleConfirmCreate = async () => {
    setIsSubmitting(true);
    setError("");

    const precioBackend =
      evento.precio && evento.precio !== ""
        ? evento.precio.replace(",", ".")
        : null;

    const formData = new FormData();
    formData.append("tipo_evento", evento.tipo);
    formData.append("nome_evento", evento.tituloEvento);
    formData.append("descripcion_evento", evento.descripcionEvento);
    if (evento.imagen) formData.append("imaxe_evento", evento.imagen);
    formData.append("data_evento", evento.fecha);
    formData.append("localizacion", evento.lugar);
    formData.append("tipo_localizacion", evento.ubicacion);
    formData.append("entradas_venta", evento.entradas.toString());
    if (precioBackend !== null) formData.append("prezo_evento", precioBackend);
    formData.append("numero_iban", evento.iban);
    formData.append(
      "condiciones_confirmacion",
      evento.condicionesConfirmacion ? "true" : "false"
    );

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:8000/crear-eventos/", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao crear o evento");

      await response.json();
      localStorage.removeItem("eventoDraft");
      navigate("/panel-organizador");
    } catch (error) {
      console.error(error);
      setError("Erro ao crear o evento. Por favor, inténtao de novo.");
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card
        className="shadow-sm"
        style={{ maxWidth: "700px", width: "100%" }}
      >
        <Card.Body className="p-4">
          <h3 className="text-center mb-4">Resumen do evento</h3>

          {/* Alert de advertencia */}
          <Alert variant="warning" className="mb-4">
            <Alert.Heading>⚠️ Advertencia importante</Alert.Heading>
            <p className="mb-0">
              Cando publiques este evento,
              os únicos campos que podrás editar serán a descipción do evento, o cartel e o teu número de conta.
                Non poderás modificar os campos básicos como o título, data, lugar,
              número de entradas e prezo. Por favor, revisa todos os datos antes de confirmar.
            </p>
          </Alert>

          {/* Resumen de campos */}
          <div className="mb-4">
            <h5 className="mb-3 text-secondary">Información do evento</h5>

            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Tipo de evento:</strong>
              </div>
              <div className="col-md-6">{evento.tipo || "-"}</div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Título:</strong>
              </div>
              <div className="col-md-6">{evento.tituloEvento || "-"}</div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Descripción:</strong>
              </div>
              <div className="col-md-6" style={{ whiteSpace: "pre-wrap" }}>
                {evento.descripcionEvento || "-"}
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Data e hora:</strong>
              </div>
              <div className="col-md-6">{formatDate(evento.fecha)}</div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Lugar:</strong>
              </div>
              <div className="col-md-6">{evento.lugar || "-"}</div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Tipo de localización:</strong>
              </div>
              <div className="col-md-6">{evento.ubicacion || "-"}</div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Número de entradas:</strong>
              </div>
              <div className="col-md-6">{evento.entradas || "-"}</div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Prezo por entrada (€):</strong>
              </div>
              <div className="col-md-6">{evento.precio || "Gratuíto"}</div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Número de conta bancaria:</strong>
              </div>
              <div className="col-md-6">{evento.iban || "-"}</div>
            </div>

            {evento.imagen && (
              <div className="row mb-3">
                <div className="col-md-6">
                  <strong>Cartel do evento:</strong>
                </div>
                <div className="col-md-6">
                  <img
                    src={URL.createObjectURL(evento.imagen)}
                    alt="Cartel do evento"
                    style={{
                      maxWidth: "200px",
                      maxHeight: "150px",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="alert alert-danger mb-3">{error}</div>
          )}

          <div className="d-flex justify-content-between mt-4">
            <Button
              className="boton-avance"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              ← Volver
            </Button>

            <Button
              className="reserva-entrada-btn"
              onClick={handleConfirmCreate}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creando..." : "Publicar evento"}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Resumen;
