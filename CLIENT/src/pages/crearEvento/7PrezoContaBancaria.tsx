import { Button, Container, Form, Card } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import React, { useState, useEffect } from "react";
import type { OutletContext } from "../crearEvento/0ElementoPadre";

const PrezoContaBancaria: React.FC = () => {
  const { evento, setEvento } = useOutletContext<OutletContext>();
  const [prezo, setPrezo] = useState<string>("");
  const [iban, setIban] = useState<string>("");
  const [errorPrezo, setErrorPrezo] = useState<string>("");
  const [errorIban, setErrorIban] = useState<string>("");
  const navigate = useNavigate();

  const [tipoEntrada, setTipoEntrada] = useState<"gratis" | "pago" | null>(null);

  // 🔹 Inicializar cos valores gardados
  useEffect(() => {
  if (evento.precio) {
    const precioNum = Number(evento.precio.replace(",", "."));
    if (!isNaN(precioNum)) {
      setPrezo(precioNum.toFixed(2).replace(".", ","));
    } else {
      setPrezo("");
    }
  }
  if (evento.iban) setIban(evento.iban);
}, [evento]);

  // 🔹 Formatear IBAN automaticamente
  const formatIBAN = (value: string) => {
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    const grouped = cleaned.match(/.{1,4}/g);
    return grouped ? grouped.join(" ") : "";
  };

  const handleIbanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatIBAN(e.target.value);
    setIban(formatted);
    setEvento({ ...evento, iban: formatted });
  };

  const handleSubmit = () => {
    let hasError = false;
    const precioNumerico = Number(prezo.replace(",", "."));
    if (!prezo || isNaN(precioNumerico) || precioNumerico <= 0) {
      setErrorPrezo("Por favor, introduce un prezo válido");
      hasError = true;
    } else {
      setErrorPrezo("");
    }

    if (!iban || iban.replace(/\s/g, "").length < 15) {
      setErrorIban("Introduce un IBAN válido");
      hasError = true;
    } else {
      setErrorIban("");
    }

    if (hasError) return;

    setEvento({ ...evento, iban: iban, precio: precioNumerico.toFixed(2).replace(".", ",") });
    navigate("/crear-evento/condiciones-legales");
  };

  return (
  <Container className="py-5 d-flex justify-content-center">
    <Card className="shadow-sm" style={{ maxWidth: "500px", width: "100%" }}>
      <Card.Body className="p-4">

        {/* PANTALLA 1 — PREGUNTA */}
        {!tipoEntrada && (
          <>
            <h3 className="text-center mb-4">
              A entrada é de balde ou ten un custo?
            </h3>

            <div className="d-grid gap-3">
              <Button
                className="reserva-entrada-btn"
                onClick={() => {
                  setEvento({ ...evento, precio: "0,00" });
                  navigate("/crear-evento/condiciones-legales");
                }}
              >
                É de balde
              </Button>

              <Button
                className="reserva-entrada-btn"
                onClick={() => setTipoEntrada("pago")}
              >
                Ten un custo
              </Button>
            </div>

            <div className="mt-4">
              <Button
                className="boton-avance"
                onClick={() => navigate(-1)}
              >
                ← Volver
              </Button>
            </div>
          </>
        )}

        {/* PANTALLA 2 — FORMULARIO DE PAGO */}
        {tipoEntrada === "pago" && (
          <>
            <h3 className="text-center mb-4">Prezo da entrada</h3>

            <Form>

              {/* PREZO */}
              <Form.Group className="mb-3">
                <Form.Label>Prezo da entrada (€)</Form.Label>
                <Form.Control
                  type="text"
                  inputMode="decimal"
                  value={prezo}
                  placeholder="Introduce o prezo da entrada en euros (€)"
                  onChange={(e) => {
                    // Reemplaza punto por coma automaticamente
                    const value = e.target.value.replace(".", ",");
                    // Permite só números e coma con máximo 2 decimais
                    const regex = /^\d*(,\d{0,2})?$/;
                    if (regex.test(value)) {
                      setPrezo(value);
                    }
                  }}
                  onBlur={() => {
                    if (!prezo) return;

                    // Engade 2 decimais automaticamente
                    let [intPart, decPart] = prezo.split(",");
                    if (!decPart) decPart = "00";
                    else if (decPart.length === 1) decPart += "0";
                    else if (decPart.length > 2) decPart = decPart.slice(0, 2);

                    setPrezo(`${intPart},${decPart}`);
                  }}
                />
                {errorPrezo && (
                  <div className="text-danger mt-2">{errorPrezo}</div>
                )}
              </Form.Group>

              {/* IBAN */}
              <Form.Group className="mb-3">
                <Form.Label>IBAN</Form.Label>

                <Form.Control
                  type="text"
                  value={iban}
                  onChange={handleIbanChange}
                  placeholder="ES12 3456 7890 1234 5678 9012"
                  maxLength={42}
                  className="py-2"
                  style={{
                    fontFamily: "monospace",
                    letterSpacing: "2px",
                    fontSize: "1.05rem",
                  }}
                />

                {errorIban && (
                  <div className="text-danger mt-2">{errorIban}</div>
                )}

                <Form.Text className="text-secondary">
                  O IBAN é necesario para ingresar o importe das entradas
                  vendidas na túa conta bancaria.
                </Form.Text>
              </Form.Group>

              {/* BOTÓNS */}
              <div className="d-flex justify-content-between mt-4">
                <Button
                  className="boton-avance"
                  onClick={() => setTipoEntrada(null)}
                >
                  ← Volver
                </Button>

                <Button
                  className="reserva-entrada-btn"
                  onClick={handleSubmit}
                >
                  Continuar
                </Button>
              </div>

            </Form>
          </>
        )}

      </Card.Body>
    </Card>
  </Container>
);
};

export default PrezoContaBancaria;
