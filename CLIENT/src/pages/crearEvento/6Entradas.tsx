import React, { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
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
      <Button
          variant="link"
          className="p-0 text-decoration-none"
          onClick={() => navigate(-1)} // Volve ao paso anterior
      >
          ← Volver
      </Button>
      <label htmlFor="entradas" style={{ display: "block", marginBottom: 6 }}>
        Máximo número de entradas
      </label>
      <input
        id="entradas"
        type="number"
        min={1}
        value={entradas}
        disabled={esAuditorio}
        onChange={(e) => setEntradas(e.target.value === "" ? "" : Number(e.target.value))}
        placeholder="Introduce o número máximo de entradas"
        style={{ 
          width: "100%", 
          padding: 8, 
          marginBottom: 10, 
          backgroundColor: esAuditorio ? '#d4edda' : 'white',
          cursor: esAuditorio ? 'not-allowed' : 'text',
        }}
      />
      {esAuditorio && (
        <p style={{ fontSize: 14, color: "#555" }}>
          ℹ️ Este auditorio ten un aforo máximo de {aforoAuditorio} butacas. Unha vez creado o evento podrás reservar as entradas no panel de usuario.
        </p>
      )}
      {error && <p style={{ color: "red", marginBottom: 10 }}>{error}</p>}

      <button
        onClick={handleSubmit}
        style={{
          padding: "10px 16px",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Continuar
      </button>
    </div>
  );
};

export default Entradas;
