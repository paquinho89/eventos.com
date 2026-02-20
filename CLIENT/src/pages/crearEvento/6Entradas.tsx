import React, { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { aforoAuditorios } from "../planoAuditorios/aforoAuditorios";
import type { OutletContext } from "../crearEvento/0ElementoPadre";

const Entradas: React.FC = () => {
  const { evento, setEvento } = useOutletContext<OutletContext>();
  const [entradas, setEntradas] = useState<number | "">(
    evento.entradas ? Number(evento.entradas) : ""
  );
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const normalizar = (t: string) =>
  t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const lugarKey = normalizar(evento.lugar);

  const aforoAuditorio = aforoAuditorios[lugarKey];
  const esAuditorio = typeof aforoAuditorio === "number";


  useEffect(() => {
    if (esAuditorio && aforoAuditorio) {
      setEntradas(aforoAuditorio);
      setEvento((prev) => ({ ...prev, entradas: aforoAuditorio 
      }));
    }
  }, [esAuditorio, aforoAuditorio]);

  const handleSubmit = () => {
    if (entradas === "" || entradas <= 0) {
      setError("Por favor, introduce un número válido de entradas");
      return;
    }
    setError("");
    setEvento({ ...evento, entradas: Number(entradas) });

    // Navegar ao seguinte paso
    navigate("/crear-evento/prezo"); // Cambia a ruta segundo o teu wizard
  };

  return (
    <div style={{ maxWidth: 400, margin: "20px auto" }}>
      <h3 className="text-center mb-4 mt-4">
        Número de entradas
      </h3>
      <Form>
        <Form.Group className="mb-3">
          <Form.Control
            type="number"
            min={1}
            value={entradas}
            disabled={esAuditorio}
            placeholder="Introduce o número máximo de entradas"
            onChange={(e) =>
              setEntradas(e.target.value === "" ? "" : Number(e.target.value))
            }
            style={{
              backgroundColor: esAuditorio ? "#ffe6f2" : undefined,
              cursor: esAuditorio ? "not-allowed" : "text",
            }}
            className="py-2"
          />
        </Form.Group>
      </Form>

      {esAuditorio && (
        <p className="text-secondary">
          Este auditorio ten un aforo máximo de {aforoAuditorio} butacas. 
          Unha vez publicado o evento, poderás reservar ou xestionar as entradas no teu panel de usuario.
        </p>


      )}
      {error && <p style={{ color: "red", marginBottom: 10 }}>{error}</p>}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
        <Button
          className="boton-avance"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </Button>

        <button
          onClick={handleSubmit}
          className="reserva-entrada-btn"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default Entradas;
