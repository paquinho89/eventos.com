import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainNavbar from "../componentes/NavBar";
import Anfiteatro from "../planoAuditorios/Planos/auditorioVerin/anfiteatro";
import ZonaCentral from "../planoAuditorios/Planos/auditorioVerin/zonaCentral";
import ZonaLateralDereita from "../planoAuditorios/Planos/auditorioVerin/zonaLateralDereita";
import ZonaLateralEsquerda from "../planoAuditorios/Planos/auditorioVerin/zonaLateralEsquerda";

const SeleccionButacaAuditorio: React.FC = () => {
  const navigate = useNavigate();
  const { zona } = useParams<{ zona: string }>();

  let ZonaComponent = null;
  switch (zona) {
    case "anfiteatro":
      ZonaComponent = <Anfiteatro />;
      break;
    case "central":
      ZonaComponent = <ZonaCentral />;
      break;
    case "esquerda":
      ZonaComponent = <ZonaLateralEsquerda />;
      break;
    case "dereita":
      ZonaComponent = <ZonaLateralDereita />;
      break;
    default:
      ZonaComponent = <div>Zona non válida</div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      <MainNavbar />
      <div style={{ maxWidth: 700, margin: "0 auto", padding: 32 }}>
        <div style={{ marginBottom: 24 }}>{ZonaComponent}</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
          <button onClick={() => navigate(-1)} style={{ padding: "10px 24px", fontWeight: 600, background: "#eee", border: "none", borderRadius: 6, color: "#222" }}>Volver</button>
          <button onClick={() => {/* Acción de continuar */}} style={{ padding: "10px 24px", fontWeight: 600, background: "#ff0093", border: "none", borderRadius: 6, color: "#fff" }}>Continuar</button>
        </div>
      </div>
    </div>
  );
};

export default SeleccionButacaAuditorio;
