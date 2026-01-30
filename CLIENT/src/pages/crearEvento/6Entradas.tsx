import React, { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

interface Evento {
  tipo: string;
  titulo_descripcion: string;
  imagen: File | null;
  fecha: string;
  lugar: string;
  entradas_precio_cuenta: string;
}

interface OutletContext {
  evento: Evento;
  setEvento: React.Dispatch<React.SetStateAction<Evento>>;
}

const Entradas: React.FC = () => {
  const { evento, setEvento } = useOutletContext<OutletContext>();
  const [entradas, setEntradas] = useState<number | "">(
    evento.entradas_precio_cuenta ? Number(evento.entradas_precio_cuenta) : ""
  );
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (entradas === "" || entradas <= 0) {
      setError("Por favor, introduce un número válido de entradas");
      return;
    }

    setError("");
    setEvento({ ...evento, entradas_precio_cuenta: entradas.toString() });

    // Navegar ao seguinte paso
    navigate("/crear-evento/lugar"); // Cambia a ruta segundo o teu wizard
  };

  return (
    <div style={{ maxWidth: 400, margin: "20px auto" }}>
      <label htmlFor="entradas" style={{ display: "block", marginBottom: 6 }}>
        Máximo número de entradas
      </label>
      <input
        id="entradas"
        type="number"
        min={1}
        value={entradas}
        onChange={(e) => setEntradas(e.target.value === "" ? "" : Number(e.target.value))}
        placeholder="Introduce o número máximo de entradas"
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />
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
