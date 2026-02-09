import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Button, Card, Alert } from "react-bootstrap";
import MainNavbar from "../componentes/NavBar";

interface ConfirmacionPago {
  eventoId: number;
  eventoNombre: string;
  cantidadEntradas: number;
  precioTotal: number;
  email?: string;
  tarjeta?: {
    ultimos4: string;
    nombre: string;
  };
  fecha_pago: string;
  estado: string;
}

export default function PagoConfirmado() {
  const navigate = useNavigate();
  const location = useLocation();
  const [confirmacion, setConfirmacion] = useState<ConfirmacionPago | null>(null);

  useEffect(() => {
    const stateConfirmacion = location.state as ConfirmacionPago | null;
    const localConfirmacion = localStorage.getItem("confirmacionPago");

    if (stateConfirmacion) {
      setConfirmacion(stateConfirmacion);
    } else if (localConfirmacion) {
      try {
        setConfirmacion(JSON.parse(localConfirmacion));
      } catch (e) {
        // Error al parsear
      }
    }
  }, [location.state]);

  if (!confirmacion) {
    return (
      <>
        <MainNavbar />
        <Container className="mt-5">
          <Alert variant="warning">No hay información de confirmación</Alert>
          <Button variant="primary" onClick={() => navigate("/")}>
            Volver a Inicio
          </Button>
        </Container>
      </>
    );
  }

  const fechaPago = new Date(confirmacion.fecha_pago).toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <MainNavbar />
      <Container className="mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <Card className="shadow-lg">
              <Card.Header className="bg-success text-white text-center py-4">
                <h3 className="mb-0">✓ Pago Confirmado</h3>
              </Card.Header>
              <Card.Body className="p-5">
                <Alert variant="success" className="text-center">
                  <h5>¡Reserva realizada con éxito!</h5>
                  <p className="mb-0">Recibirás un email con los detalles de tu reserva</p>
                </Alert>

                <hr className="my-4" />

                <div className="mb-4">
                  <h5 className="mb-3">Detalles de tu Reserva</h5>

                  <div className="row mb-3">
                    <div className="col-6">
                      <small className="text-muted d-block">Evento</small>
                      <strong>{confirmacion.eventoNombre}</strong>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-block">Número de Entradas</small>
                      <strong>{confirmacion.cantidadEntradas}</strong>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-6">
                      <small className="text-muted d-block">Importe Total</small>
                      <strong className="text-success fs-5">{confirmacion.precioTotal} €</strong>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-block">Data e Hora do Pago</small>
                      <strong>{fechaPago}</strong>
                    </div>
                  </div>

                  {confirmacion.tarjeta && (
                    <div className="row mb-3">
                      <div className="col-6">
                        <small className="text-muted d-block">Tarjeta Utilizada</small>
                        <strong>
                          {confirmacion.tarjeta.nombre} (****{confirmacion.tarjeta.ultimos4})
                        </strong>
                      </div>
                    </div>
                  )}
                </div>

                <hr className="my-4" />

                {confirmacion.email && (
                  <div className="alert alert-info mb-4">
                    <strong>📧 Email de Notificaciones:</strong>
                    <p className="mb-0 mt-2">{confirmacion.email}</p>
                    <small className="text-muted">
                      Recibirás notificaciones de eventos en tu zona
                    </small>
                  </div>
                )}

                <div className="alert alert-light border">
                  <small className="text-muted">
                    <strong>Número de Referencia:</strong> {confirmacion.eventoId}-{new Date().getTime()}
                  </small>
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-5">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate("/")}
                    className="flex-grow-1"
                  >
                    Explorar Más Eventos
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="lg"
                    onClick={() => window.print()}
                    className="flex-grow-1"
                  >
                    Imprimir Confirmación
                  </Button>
                </div>
              </Card.Body>
            </Card>

            <Card className="mt-4 bg-light border-0">
              <Card.Body>
                <h6 className="mb-3">¿Qué sucede a continuación?</h6>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <strong>✓ Confirmación por Email:</strong> Recibirás un email con tu reserva y número de referencia en los próximos minutos
                  </li>
                  <li className="mb-2">
                    <strong>✓ Entradas:</strong> También recibirás tus entradas digitales por email
                  </li>
                  <li className="mb-2">
                    <strong>✓ Cambios:</strong> Si necesitas cambiar tu reserva, contacta con nosotros
                  </li>
                  <li>
                    <strong>✓ Presentación:</strong> Presenta tu entrada en tu dispositivo móvil o impresa en el evento
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </>
  );
}
