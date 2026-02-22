import React, { useState } from "react";
import "../../../estilos/BotonesAuditorios.css";
import AuditorioVerinAnfiteatro from "../Planos/auditorioVerin/anfiteatro";
import AuditorioVerinZonaCentral from "../Planos/auditorioVerin/zonaCentral";
import AuditorioVerinLateralDereita from "../Planos/auditorioVerin/zonaLateralDereita";
import AuditorioVerinLateralEsquerda from "../Planos/auditorioVerin/zonaLateralEsquerda";

type Zona = "anfiteatro" | "esquerda" | "central" | "dereita";

interface Props {
  onZonaClick?: (zona: Zona) => void; // opcional
}

const AuditorioSelectorVerin: React.FC<Props> = ({ onZonaClick }) => {
  const [zonaSeleccionada, setZonaSeleccionada] = useState<Zona | null>(null);

  const handleClick = (zona: Zona) => {
    setZonaSeleccionada(zona);
    if (onZonaClick) onZonaClick(zona);
  };

  const renderEsquema = () => {
    if (!zonaSeleccionada) return null;
    switch (zonaSeleccionada) {
      case "anfiteatro":
        return <AuditorioVerinAnfiteatro />;
      case "central":
        return <AuditorioVerinZonaCentral />;
      case "esquerda":
        return <AuditorioVerinLateralEsquerda />;
      case "dereita":
        return <AuditorioVerinLateralDereita />;
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
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <h4>{zonaSeleccionada.toUpperCase()}</h4>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setZonaSeleccionada(null)}
              >
                Cerrar
              </button>
            </div>
            {renderEsquema()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditorioSelectorVerin;