import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Button, Form, Card, Alert, Spinner } from "react-bootstrap";
import MainNavbar from "../componentes/NavBar";

interface ReservaData {
  eventoId: number;
  eventoNombre: string;
  cantidadEntradas: number;
  precioUnitario: number;
  precioTotal: number;
  imaxe_evento?: string;
  localizacion?: string;
  data_evento?: string;
}

export default function PagarEntrada() {
  const navigate = useNavigate();
  const location = useLocation();
  const [reserva, setReserva] = useState<ReservaData | null>(null);
  const [loading, setLoading] = useState(true);

  // Formulario de tarjeta
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [nombreTarjeta, setNombreTarjeta] = useState("");
  const [mesExpiracion, setMesExpiracion] = useState("");
  const [anoExpiracion, setAnoExpiracion] = useState("");
  const [cvv, setCvv] = useState("");
  const [email, setEmail] = useState("");
  const [aceptarNotificaciones, setAceptarNotificaciones] = useState(false);

  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Obtener datos de reserva del location state o localStorage
    const stateReserva = location.state as ReservaData | null;
    const localReserva = localStorage.getItem("reservaEvento");

    if (stateReserva) {
      setReserva(stateReserva);
    } else if (localReserva) {
      try {
        setReserva(JSON.parse(localReserva));
      } catch (e) {
        setError("Error al cargar datos de reserva");
      }
    } else {
      setError("No hay datos de reserva. Vuelve a intentar.");
    }

    setLoading(false);
  }, [location.state]);

  const handleConfirmPago = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones básicas
    if (!numeroTarjeta || !nombreTarjeta || !mesExpiracion || !anoExpiracion || !cvv) {
      setError("Por favor completa todos los campos de la tarjeta");
      return;
    }

    if (aceptarNotificaciones && !email) {
      setError("Por favor ingresa tu email para recibir notificaciones");
      return;
    }

    setProcesando(true);

    try {
      // Simular procesamiento de pago
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Datos de confirmación
      const confirmacion = {
        ...reserva,
        tarjeta: {
          ultimos4: numeroTarjeta.slice(-4),
          nombre: nombreTarjeta,
        },
        email: aceptarNotificaciones ? email : null,
        fecha_pago: new Date().toISOString(),
        estado: "confirmada",
      };

      // Guardar en localStorage
      localStorage.setItem("confirmacionPago", JSON.stringify(confirmacion));
      localStorage.removeItem("reservaEvento");

      // Navegar a página de éxito
      navigate("/pago-confirmado", { state: confirmacion });
    } catch (e: any) {
      setError("Error al procesar el pago. Intenta nuevamente.");
    } finally {
      setProcesando(false);
    }
  };

  if (loading) {
    return (
      <>
        <MainNavbar />
        <Container className="text-center mt-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </Container>
      </>
    );
  }

  if (error && !reserva) {
    return (
      <>
        <MainNavbar />
        <Container className="mt-5">
          <Alert variant="danger">{error}</Alert>
          <Button variant="primary" onClick={() => navigate("/")}>
            Volver a Inicio
          </Button>
        </Container>
      </>
    );
  }

  if (!reserva) {
    return (
      <>
        <MainNavbar />
        <Container className="mt-5">
          <Alert variant="danger">No hay datos de reserva</Alert>
          <Button variant="primary" onClick={() => navigate("/")}>
            Volver a Inicio
          </Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <MainNavbar />
      <Container className="mt-5 mb-5">
        <div className="row">
          {/* Resumen de la reserva */}
          <div className="col-md-4 mb-4">
            <Card className="sticky-top" style={{ top: "100px" }}>
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">Resumen de Reserva</h5>
              </Card.Header>
              <Card.Body>
                <h6 className="mb-3">{reserva.eventoNombre}</h6>

                {reserva.imaxe_evento && (
                  <img
                    src={
                      reserva.imaxe_evento.startsWith("http")
                        ? reserva.imaxe_evento
                        : `http://localhost:8000${reserva.imaxe_evento}`
                    }
                    alt={reserva.eventoNombre}
                    className="img-fluid mb-3 rounded"
                    style={{ maxHeight: "200px", objectFit: "cover" }}
                  />
                )}

                {reserva.localizacion && (
                  <p className="mb-2">
                    <strong>📍 Lugar:</strong> {reserva.localizacion}
                  </p>
                )}

                {reserva.data_evento && (
                  <p className="mb-3">
                    <strong>📅 Data:</strong>{" "}
                    {new Date(reserva.data_evento).toLocaleDateString("es-ES")}
                  </p>
                )}

                <hr />

                <div className="mb-3">
                  <p className="mb-1">
                    <strong>Entradas:</strong> {reserva.cantidadEntradas}
                  </p>
                  <p className="mb-3">
                    <strong>Prezo unitario:</strong> {reserva.precioUnitario} €
                  </p>
                </div>

                <div className="alert alert-success">
                  <strong>Total:</strong> <span className="fs-5">{reserva.precioTotal} €</span>
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* Formulario de pago */}
          <div className="col-md-8">
            <Card>
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">Información de Pago</h5>
              </Card.Header>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleConfirmPago}>
                  {/* Datos de tarjeta */}
                  <h6 className="mb-3">Datos da Tarxeta de Crédito</h6>

                  <Form.Group className="mb-3">
                    <Form.Label>Número de Tarjeta</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      value={numeroTarjeta}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, "");
                        if (/^\d*$/.test(value) && value.length <= 16) {
                          // Añadir espacios cada 4 dígitos
                          const formatted = value.replace(/(\d{4})/g, "$1 ").trim();
                          setNumeroTarjeta(formatted);
                        }
                      }}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Nombre do Titular</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Juan Pérez Sánchez"
                      value={nombreTarjeta}
                      onChange={(e) => setNombreTarjeta(e.target.value.toUpperCase())}
                      required
                    />
                  </Form.Group>

                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group className="mb-3">
                        <Form.Label>Fecha Expiración</Form.Label>
                        <div className="d-flex gap-2">
                          <Form.Control
                            type="number"
                            placeholder="MM"
                            min="01"
                            max="12"
                            maxLength={2}
                            value={mesExpiracion}
                            onChange={(e) => {
                              const mes = e.target.value;
                              if (mes.length <= 2) {
                                setMesExpiracion(mes);
                              }
                            }}
                            required
                          />
                          <span className="align-self-center">/</span>
                          <Form.Control
                            type="number"
                            placeholder="YY"
                            min="25"
                            max="99"
                            maxLength={2}
                            value={anoExpiracion}
                            onChange={(e) => {
                              const ano = e.target.value;
                              if (ano.length <= 2) {
                                setAnoExpiracion(ano);
                              }
                            }}
                            required
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-6">
                      <Form.Group className="mb-3">
                        <Form.Label>CVV</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="123"
                          maxLength={4}
                          value={cvv}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                              setCvv(value);
                            }
                          }}
                          required
                        />
                      </Form.Group>
                    </div>
                  </div>

                  <hr />

                  {/* Notificaciones */}
                  <h6 className="mb-3">Notificacións</h6>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Quiero recibir eventos de mi zona"
                      checked={aceptarNotificaciones}
                      onChange={(e) => setAceptarNotificaciones(e.target.checked)}
                    />
                  </Form.Group>

                  {aceptarNotificaciones && (
                    <Form.Group className="mb-4">
                      <Form.Label>Email para Notificaciones</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="ejemplo@correo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required={aceptarNotificaciones}
                      />
                      <Form.Text className="text-muted">
                        Recibirás notificaciones de eventos en tu zona
                      </Form.Text>
                    </Form.Group>
                  )}

                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => navigate(-1)}
                      disabled={procesando}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="success"
                      size="lg"
                      type="submit"
                      disabled={procesando}
                    >
                      {procesando ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Procesando...
                        </>
                      ) : (
                        `Pagar ${reserva.precioTotal} €`
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </>
  );
}
