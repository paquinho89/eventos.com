import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import "../../estilos/TarjetaEventoHome.css";
import "../../estilos/Botones.css";
import { FaCalendarAlt, FaMapMarkerAlt, FaEuroSign, FaClock } from "react-icons/fa";

interface EventoHomeProps {
  evento: {
    id: number;
    imaxe_evento?: string | null;
    nome_evento: string;
    data_evento: string;
    localizacion: string;
    entradas_venta: number;
    prezo_evento?: number;
  };
}

export default function TarjetaEventoHome({ evento }: EventoHomeProps) {
  const navigate = useNavigate();

  const imageUrl = evento.imaxe_evento
    ? (evento.imaxe_evento.startsWith("http") ? evento.imaxe_evento : `http://localhost:8000${evento.imaxe_evento}`)
    : null;

  const handleReservation = () => {
    navigate(`/evento/${evento.id}`);
  };

  const dataFormato = new Date(evento.data_evento).toLocaleDateString("es-ES", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const horaFormato = new Date(evento.data_evento).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="card shadow-sm h-100 position-relative tarjeta-evento" style={{ overflow: "hidden", cursor: "pointer" }} onClick={handleReservation}>
      {/* Título arriba de la imagen */}
      <div className="card-header">
        <h6 className="card-header mt-0 mb-0">{evento.nome_evento}</h6>
      </div>

      {/* Imagen */}
      {imageUrl && (
        <img
          src={imageUrl}
          className="card-img-top"
          alt={evento.nome_evento}
          style={{ objectFit: "cover", height: "200px" }}
        />
      )}

      {/* Contenido */}
      <div className="card-body d-flex flex-column">

        <p className="card-text mb-2">
            <FaEuroSign style={{ marginRight: "6px" }} />
           {evento.prezo_evento}
        </p>

        <p className="card-text mb-2">
            <FaMapMarkerAlt style={{ marginRight: "6px" }} />
           {evento.localizacion}
        </p>

        <p className="card-text mb-2 text-muted">
            <FaCalendarAlt className="me-1" />
           {dataFormato}
        </p>

        <p className="card-text mb-2 text-muted">
            <FaClock className="me-1" />
          {horaFormato}
        </p>

        {/* Botón de reserva */}
        <Button 
          variant="success" 
          className="reserva-entrada-btn"
          onClick={handleReservation}
          disabled={evento.entradas_venta === 0}
        >
          {evento.entradas_venta > 0 ? "Reservar Entrada" : "Agotadas"}
        </Button>
      </div>
    </div>
  );
}
