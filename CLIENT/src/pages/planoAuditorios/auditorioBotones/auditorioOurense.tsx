import React, { useState } from "react";
import "../../../estilos/BotonesAuditorios.css";
import AuditorioOurenseAnfiteatro from "../Planos/auditorioOurense/anfiteatro";
import AuditorioOurenseZonaCentral from "../Planos/auditorioOurense/zonaCentral";
import AuditorioOurenseDereita from "../Planos/auditorioOurense/dereita";
import AuditorioOurenseEsquerda from "../Planos/auditorioOurense/esquerda";

type Zona = "anfiteatro" | "esquerda" | "central" | "dereita";

interface Props {
  eventoId?: number;
  onZonaClick?: (zona: Zona) => void; // opcional
}

const AuditorioSelectorOurense: React.FC<Props> = ({ onZonaClick }) => {
  const [zonaSeleccionada, setZonaSeleccionada] = useState<Zona | null>(null);

  const handleClick = (zona: Zona) => {
    setZonaSeleccionada(zona);
    if (onZonaClick) onZonaClick(zona);
  };
  const seleccionadas = seats.flat().filter((s) => s).length;

  const renderEsquema = () => {
    if (!zonaSeleccionada) return null;
    switch (zonaSeleccionada) {
      case "anfiteatro":
        return <AuditorioOurenseAnfiteatro />;
      case "central":
        return <AuditorioOurenseZonaCentral />;
      case "esquerda":
        return <AuditorioOurenseEsquerda />;
      case "dereita":
        return <AuditorioOurenseDereita />;
      default:
        return null;
    }
  };

  return (
    <div className="auditorio-container">
      {/* BOTONES */}
      <button
        className="zona anfiteatro"
        onClick={() => handleClick("anfiteatro")}
      >
        ANFITEATRO
      </button>

      <div className="platea">
        <button className="zona esquerda" onClick={() => handleClick("esquerda")}>
          ESQUERDA
        </button>
        <button className="zona central" onClick={() => handleClick("central")}>
          CENTRAL
        </button>
        <button className="zona dereita" onClick={() => handleClick("dereita")}>
          DEREITA
        </button>
      </div>

      {/* MODAL */}
      {zonaSeleccionada && (
        <div
          className="modal-backdrop"
          onClick={() => setZonaSeleccionada(null)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

          {/* Header do modal */}
          <div className="modal-header-custom">
            <h4 className="modal-title">
              {zonaSeleccionada.toUpperCase()}
            </h4>

            <button
              className="reserva-entrada-btn"
              onClick={() => setZonaSeleccionada(null)}
            >
              Cerrar
            </button>
          </div>

          {/* Contido */}
          <div className="modal-body-custom">
            {renderEsquema()}
          </div>
          <button
            className="reserva-entrada-btn"
            disabled={seleccionadas === 0}
          >
            Reservar {seleccionadas > 0 && seleccionadas} Entradas
          </button>

</div>
        </div>
      )}
    </div>
  );
};

export default AuditorioSelectorOurense;