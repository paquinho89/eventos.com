import { Button, Container, Form, Card } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import React, { useState, useEffect } from "react";
import type { OutletContext } from "../crearEvento/0ElementoPadre";

const PrezoContaBancaria: React.FC = () => {
  const { evento, setEvento } = useOutletContext<OutletContext>();
  const [prezo, setPrezo] = useState<number>(0);
  const [iban, setIban] = useState<string>("");
  const [errorPrezo, setErrorPrezo] = useState<string>("");
  const [errorIban, setErrorIban] = useState<string>("");
  const navigate = useNavigate();

  // 🔹 Inicializar cos valores gardados
  useEffect(() => {
    if (evento.precio) setPrezo(evento.precio);
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

    if (prezo <= 0) {
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

    setEvento({ ...evento, iban: iban, precio: prezo });
    navigate("/crear-evento/condiciones-legales");
  };

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card
        className="shadow-sm"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <Card.Body className="p-4">
          <h3 className="text-center mb-4">Prezo da entrada</h3>

          <Form>

            {/* PREZO */}
            <Form.Group className="mb-3">
              <Form.Label>Prezo da entrada (€)</Form.Label>
              <Form.Control
                type="number"
                min={1}
                value={prezo}
                placeholder="Introduce o prezo da entrada en euros"
                onChange={(e) =>
                  setPrezo(
                    e.target.value === "" ? 0 : Number(e.target.value)
                  )
                }
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
                O IBAN é necesario para ingresar o importe das entradas vendidas
                na túa conta bancaria. Asegúrate de que é correcto para evitar
                retrasos nos pagos.
              </Form.Text>
            </Form.Group>

            {/* BOTÓNS */}
            <div className="d-flex justify-content-between mt-4">
              <Button
                className="boton-avance"
                onClick={() => navigate(-1)}
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
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PrezoContaBancaria;
