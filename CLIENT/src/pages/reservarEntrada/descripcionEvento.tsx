import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Spinner, Alert } from "react-bootstrap";
import MainNavbar from "../componentes/NavBar";
import "../../estilos/TarjetaEventoHome.css";
import "../../estilos/Botones.css";
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaTicketAlt } from "react-icons/fa";

interface evento {
  id: number;
  imaxe_evento?: string | null;
  nome_evento: string;
  data_evento: string;
  localizacion: string;
  entradas_venta: number;
  prezo_evento?: number;
  descripcion_evento?: string;
  tipo_evento?: string;
}

export default function DescripcionEvento() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [evento, setEvento] = useState<evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        setLoading(true);
        setError(null);

        const resp = await fetch(`http://localhost:8000/crear-eventos/publicos/`);
        
        if (!resp.ok) {
          throw new Error(`Error al cargar evento: ${resp.status}`);
        }

        const data = await resp.json();
        
        // Buscar el evento con ID coincidente
        const eventoEncontrado = Array.isArray(data) 
          ? data.find((ev: evento) => ev.id === parseInt(id || "0"))
          : null;

        if (!eventoEncontrado) {
          throw new Error("Evento non encontrado");
        }

        setEvento(eventoEncontrado);
      } catch (e: any) {
        console.error("Error fetching evento", e);
        setError(e.message || "Error ao cargar evento");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvento();
    }
  }, [id]);

  const handleReservation = () => {
    if (!evento) return;
    const precioTotal = (evento.prezo_evento || 0) * cantidad;

    // Guardar datos de reserva en localStorage
    const reservaData = {
      eventoId: evento.id,
      eventoNombre: evento.nome_evento,
      cantidadEntradas: cantidad,
      precioUnitario: evento.prezo_evento,
      precioTotal: precioTotal,
      imaxe_evento: evento.imaxe_evento,
      localizacion: evento.localizacion,
      data_evento: evento.data_evento,
    };

    localStorage.setItem("reservaEvento", JSON.stringify(reservaData));

    // Navegar a página de pago pasando datos
    navigate(`/reservar-entrada/${evento.id}`);
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

  if (error || !evento) {
    return (
      <>
        <MainNavbar />
        <Container className="mt-5">
          <Alert variant="danger">{error || "Evento non encontrado"}</Alert>
          <Button variant="primary" onClick={() => navigate("/")}>
            Volver a Inicio
          </Button>
        </Container>
      </>
    );
  }

  const imageUrl = evento.imaxe_evento
    ? evento.imaxe_evento.startsWith("http")
      ? evento.imaxe_evento
      : `http://localhost:8000${evento.imaxe_evento}`
    : null;

  const dataFormato = new Date(evento.data_evento).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const horaFormato = new Date(evento.data_evento).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <MainNavbar />
      <Container className="mt-5">
        <div className="row">
          {/* Imagen grande */}
          <div className="col-md-6 mb-4">
            {imageUrl && (
              <img
                src={imageUrl}
                alt={evento.nome_evento}
                className="img-fluid rounded shadow"
                style={{ maxHeight: "500px", objectFit: "cover", width: "100%" }}
              />
            )}
          </div>

          {/* Detalles del evento */}
          <div className="col-md-6">
            <h1 className="mb-3">{evento.nome_evento}</h1>

            {evento.tipo_evento && (
              <p className="text-muted">
                {evento.tipo_evento}
              </p>
            )}
            <Button
              variant="success"
              size="lg"
              className="reserva-entrada-verde-btn mb-3"
              onClick={handleReservation}
              disabled={evento.entradas_venta === 0}
            >
              {evento.entradas_venta > 0 ? "Reservar Entrada" : "Agotadas"}
            </Button>

            {/* Detalles principales */}
            <div className="card mb-4 p-3">
              <p className="mb-2">
                <FaCalendarAlt className="me-1" />
                <strong>Fecha:</strong> {dataFormato}
              </p>
              <p className="mb-2">
                <FaClock className="me-1" />
                <strong>Hora:</strong> {horaFormato}
              </p>
              <p className="mb-2">
                <FaMapMarkerAlt className="me-1" />
                <strong>Localización:</strong> {evento.localizacion}
              </p>
              <p className="mb-2">
                <FaTicketAlt className="me-1" />
                <strong>Entradas disponibles:</strong> {evento.entradas_venta}
              </p>
              <p className="mb-0">
                <strong className="text-success fs-5">Prezo: {evento.prezo_evento} €</strong>
              </p>
            </div>

            {/* Descripción */}
            {evento.descripcion_evento && (
              <div className="mb-4">
                <h4>Descripción</h4>
                <p>{evento.descripcion_evento}</p>
              </div>
            )}

            {/* Botón de reserva */}
            <div className="d-flex gap-3">
              <Button
                variant="success"
                size="lg"
                className="reserva-entrada-verde-btn mb-3"
                onClick={handleReservation}
                disabled={evento.entradas_venta === 0}
              >
                {evento.entradas_venta > 0 ? "Reservar Entrada" : "Agotadas"}
              </Button>

              <Button
                className="volver-verde-btn"
                onClick={() => navigate("/")}
              >
                Volver
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
