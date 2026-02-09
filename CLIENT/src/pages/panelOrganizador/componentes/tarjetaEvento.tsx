import React from "react";
import { useNavigate } from "react-router-dom";

interface EventoProps {
  evento: {
    id: number;
    imaxe_evento?: string | null;
    nome_evento: string;
    data_evento: string;
    localizacion: string;
    entradas_venta: number;
    // outros campos opcionais
  };
}

export default function TarjetaEvento({ evento }: EventoProps) {
  const navigate = useNavigate();

  const imageUrl = evento.imaxe_evento
    ? (evento.imaxe_evento.startsWith("http") ? evento.imaxe_evento : `http://localhost:8000${evento.imaxe_evento}`)
    : null;

  const handleManage = () => {
    navigate(`/panel-organizador/evento/${evento.id}`);
  };

  return (
    <div className="card shadow-sm h-100">
      {imageUrl && (
        <img
          src={imageUrl}
          className="card-img-top"
          alt={evento.nome_evento}
          style={{ objectFit: "cover", height: "180px" }}
        />
      )}

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{evento.nome_evento}</h5>

        <p className="card-text mb-1">📅 <strong>Data:</strong> {new Date(evento.data_evento).toLocaleString()}</p>
        <p className="card-text mb-1">📍 <strong>Lugar:</strong> {evento.localizacion}</p>
        <p className="card-text mb-1">🎟️ <strong>Entradas dispoñibles:</strong> {evento.entradas_venta}</p>

        <button
          className="btn btn-primary mt-auto"
          onClick={handleManage}
        >
          Gestionar este evento
        </button>
      </div>
    </div>
  );
}
