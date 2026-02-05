import React, { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import type { OutletContext } from "../crearEvento/0ElementoPadre";

const CondicionesLegales: React.FC = () => {
  const { evento, setEvento } = useOutletContext<OutletContext>();
  const [aceptacionCondiciones, setAceptacionCondiciones] = useState<boolean>(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!aceptacionCondiciones) {
      setError("Por favor, acepta y lea las condiciones legales");
      return;
    }
    setError("");
    setEvento({ ...evento, condiciones_confirmacion: aceptacionCondiciones });

    // Navegar ao seguinte paso
    navigate("/crear-evento/panel-usuario"); // Cambia a ruta segundo o teu wizard
  };

  return (
    <div style={{ maxWidth: 500, margin: "20px auto" }}>
      <Button
        variant="link"
        className="p-0 text-decoration-none mb-3"
        onClick={() => navigate(-1)}
      >
        ← Volver
      </Button>

      <h3>Condiciones Legales</h3>
      <div 
        style={{
          border: "1px solid #ccc",
          padding: 15,
          marginBottom: 10,
          maxHeight: 200,
          overflowY: "scroll",
          whiteSpace: "pre-wrap"
        }}
      >
        <ul>
          <li>La página web no cobra ningún gasto de gestión</li>
          <li>El organizador se responsabiliza de tener un seguro y de lo que pase en el evento la página se exime de cualquier responsabilidad.</li>
          <li>En caso de cancelación el dinero recaudado se devolverá al espectador</li>
          <li>En caso de cancelación el dinero recaudado se devolverá al espectador</li>
          <li>En caso de cancelación el dinero recaudado se devolverá al espectador</li>
        </ul>
      </div>

      <Form.Check 
        type="checkbox"
        label="He leído y acepto las condiciones legales"
        checked={aceptacionCondiciones}
        onChange={(e) => setAceptacionCondiciones(e.target.checked)}
        style={{ marginBottom: 10 }}
      />

      {error && <p style={{ color: "red", marginBottom: 10 }}>{error}</p>}

      <Button onClick={handleSubmit} variant="success">
        Continuar
      </Button>
    </div>
  );
};

export default CondicionesLegales;
