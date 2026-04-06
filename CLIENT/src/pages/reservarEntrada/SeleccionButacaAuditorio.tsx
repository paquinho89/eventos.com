import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "react-bootstrap";
import AuditorioSelectorVerin from "../planoAuditorios/auditorioBotones/auditorioVerin";
import AuditorioSelectorOurense from "../planoAuditorios/auditorioBotones/auditorioOurense";

// Este componente asume que recibe o evento e as zonas do auditorio por props ou location.state
const zonasAuditorio = ["Zona A", "Zona B", "Zona C"]; // Exemplo, adaptar ao teu modelo

const SeleccionButacaAuditorio: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { evento } = location.state || {};
  const [zonaActual, setZonaActual] = useState(0);

  // Selecciona o compoñente de auditorio segundo o evento
  const AuditorioComponente = evento?.localizacion?.toLowerCase().includes("verin")
    ? AuditorioSelectorVerin
    : AuditorioSelectorOurense;

  const handleZonaChange = (delta: number) => {
    setZonaActual((prev) => {
      let next = prev + delta;
      if (next < 0) next = zonasAuditorio.length - 1;
      if (next >= zonasAuditorio.length) next = 0;
      return next;
    });
  };

  return (
    <div className="seleccion-butaca-auditorio-fullscreen" style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      <div className="d-flex justify-content-between align-items-center mb-4" style={{ padding: 24 }}>
        <Button variant="light" onClick={() => handleZonaChange(-1)}>&lt;</Button>
        <h3 style={{ margin: 0 }}>{zonasAuditorio[zonaActual]}</h3>
        <Button variant="light" onClick={() => handleZonaChange(1)}>&gt;</Button>
      </div>
      {evento && evento.id ? (
        <>
          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <AuditorioComponente eventoId={evento.id} />
          </div>
          <div className="d-flex justify-content-center mt-4">
            <Button className="boton-avance" onClick={() => navigate("/reservar-entrada/datos", { state: { evento, zona: zonasAuditorio[zonaActual] } })}>
              Continuar
            </Button>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', color: '#ff0093', marginTop: 40 }}>
          Non se atopou o evento.
        </div>
      )}
    </div>
  );
};

export default SeleccionButacaAuditorio;
