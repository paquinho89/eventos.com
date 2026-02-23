import React, { useState } from "react";
import "../../../estilos/BotonesAuditorios.css";
import AuditorioVerinAnfiteatro from "../Planos/auditorioVerin/anfiteatro";
import AuditorioVerinZonaCentral from "../Planos/auditorioVerin/zonaCentral";
import AuditorioVerinLateralDereita from "../Planos/auditorioVerin/zonaLateralDereita";
import AuditorioVerinLateralEsquerda from "../Planos/auditorioVerin/zonaLateralEsquerda";

type Zona = "anfiteatro" | "esquerda" | "central" | "dereita";

interface Props {
  onZonaClick?: (zona: Zona) => void;
}

const AuditorioSelectorVerin: React.FC<Props> = ({ onZonaClick }) => {

  const [zonaSeleccionada, setZonaSeleccionada] = useState<Zona | null>(null);
  const [entradasSeleccionadas, setEntradasSeleccionadas] = useState(0);

  const handleClick = (zona: Zona) => {
    setZonaSeleccionada(zona);
    setEntradasSeleccionadas(0);
    onZonaClick?.(zona);
  };

  const cerrarModal = () => {
    setZonaSeleccionada(null);
    setEntradasSeleccionadas(0);
  };

  const renderEsquema = () => {
    switch (zonaSeleccionada) {
      case "anfiteatro":
        return (
          <AuditorioVerinAnfiteatro
            onSelectionChange={setEntradasSeleccionadas}
          />
        );
      case "central":
        return (<AuditorioVerinZonaCentral 
          onSelectionChange={setEntradasSeleccionadas}
          />
        );
      case "esquerda":
        return (<AuditorioVerinLateralEsquerda 
          onSelectionChange={setEntradasSeleccionadas}
          />
        );
      case "dereita":
        return (<AuditorioVerinLateralDereita 
          onSelectionChange={setEntradasSeleccionadas}
          />
        );
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
        <button
          className="zona esquerda"
          onClick={() => handleClick("esquerda")}
        >
          ESQUERDA
        </button>

        <button
          className="zona central"
          onClick={() => handleClick("central")}
        >
          CENTRAL
        </button>

        <button
          className="zona dereita"
          onClick={() => handleClick("dereita")}
        >
          DEREITA
        </button>
      </div>

      {/* MODAL */}
      {zonaSeleccionada && (
        <div className="modal-backdrop" onClick={cerrarModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >

            {/* HEADER */}
            {/* HEADER */}
            <div className="modal-header-custom">
              <div className="modal-title-group">
                <h4 className="modal-title">
                  {zonaSeleccionada.toUpperCase()}
                </h4>
                <p className="modal-subtitle">
                  *Selecciona as butacas que queres reservar
                </p>
              </div>

              {/* Cruz arriba dereita */}
              <button className="close-x" onClick={cerrarModal}>
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="modal-body-custom">
              {renderEsquema()}
            </div>

            {/* FOOTER */}
            <div className="modal-footer-custom">

              {/* Cerrar abaixo esquerda */}
              <button className="volver-btn" onClick={cerrarModal}>
                Cerrar
              </button>

              {/* Reservar abaixo dereita */}
              <button
                className="reserva-entrada-btn"
                disabled={entradasSeleccionadas === 0}
              >
                Reservar {entradasSeleccionadas > 0 ? entradasSeleccionadas : ""} Entradas
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AuditorioSelectorVerin;