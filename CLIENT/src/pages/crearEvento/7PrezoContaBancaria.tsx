import { Button } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import React, { useState, useEffect } from "react";
import type { OutletContext } from "../crearEvento/0ElementoPadre";


const PrezoContaBancaria: React.FC = () => {
  const { evento, setEvento } = useOutletContext<OutletContext>();
  const [ prezo, setPrezo ] = useState<number>(0);
  const [iban, setIban] = useState<string>("");
  const [errorPrezo, setErrorPrezo] = useState<string>("");
  const [errorIban, setErrorIban] = useState<string>("");
  const navigate = useNavigate();

    // 🔹 Inicializamos co valor que xa está en evento
  useEffect(() => {
    if (evento.precio) setPrezo(evento.precio);
    if (evento.iban) setIban(evento.iban);
  }, [evento]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // quitar espazos e poñer maiúsculas
    const raw = e.target.value.replace(/\s/g, "").toUpperCase();

    // poñer espazos cada 4 caracteres
    const formatted = raw.match(/.{1,4}/g)?.join(" ") ?? "";

    setIban(formatted);
    setEvento({ ...evento, iban: formatted });
  };


  const handleSubmit = () => {
    let hasError = false;

    if (prezo <= 0) {
      setErrorPrezo("Por favor, introduce un precio válido");
      hasError = true;
    } else setErrorPrezo("");

    if (!iban) {
      setErrorIban("Por favor, introduce un número de cuenta válido");
      hasError = true;
    } else setErrorIban("");

    if (hasError) return;

    setEvento({...evento, iban: iban, precio: prezo});

    navigate("/crear-evento/condiciones-legales");
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
            Prezo da entrada
          </label>
          <input
            id="prezo"
            type="number"
            min={1}
            value={prezo}
            onChange={(e) => setPrezo(e.target.value === "" ? 0 : Number(e.target.value))}
            placeholder="Introduce o prezo da entrada en euros"
            style={{ 
              width: "100%", 
              padding: 8, 
              marginBottom: 10, 
            }}
          />
          {errorPrezo && <p style={{ color: "red", marginBottom: 10 }}>{errorPrezo}</p>}
          <label htmlFor="iban">IBAN / SWIFT</label>
            <input
              id="iban"
              type="text"
              value={iban}
              onChange={handleChange}
              placeholder="DE89 3704 0044 0532 0130 00"
              maxLength={34 + 8} // máximo IBAN 34 caracteres + espazos
              style={{ fontFamily: "monospace", letterSpacing: 1.5 }}
            />
          {errorIban && <p style={{ color: "red", marginBottom: 10 }}>{errorIban}</p>}
    
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
}

export default PrezoContaBancaria;
