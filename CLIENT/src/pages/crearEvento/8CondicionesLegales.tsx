import React, { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Button, Form, Container, Card } from "react-bootstrap";
import type { OutletContext } from "../crearEvento/0ElementoPadre";

const CondicionesLegales: React.FC = () => {
  const { evento, setEvento } = useOutletContext<OutletContext>();
  const [aceptacionCondiciones, setAceptacionCondiciones] =
    useState<boolean>(evento.condicionesConfirmacion || false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!aceptacionCondiciones) {
      setError("Por favor, acepta as condicións legais");
      return;
    }
    setError("");

    setEvento({
      ...evento,
      condicionesConfirmacion: aceptacionCondiciones,
    });

    const precioBackend =
      evento.precio && evento.precio !== ""
        ? evento.precio.replace(",", ".")
        : null;
    
    const formData = new FormData();
    formData.append("tipo_evento", evento.tipo);
    formData.append("nome_evento", evento.tituloEvento);
    formData.append("descripcion_evento", evento.descripcionEvento);
    if (evento.imagen) formData.append("imaxe_evento", evento.imagen);
    formData.append("data_evento", evento.fecha);
    formData.append("localizacion", evento.lugar);
    formData.append("tipo_localizacion", evento.ubicacion);
    formData.append("entradas_venta", evento.entradas.toString());
    if (precioBackend !== null) formData.append("prezo_evento", precioBackend);
    formData.append("numero_iban", evento.iban);
    formData.append(
      "condiciones_confirmacion",
      aceptacionCondiciones ? "true" : "false"
    );

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:8000/crear-eventos/", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao crear o evento");

      await response.json();
      navigate("/panel-organizador");
    } catch (error) {
      console.error(error);
      alert("Erro ao crear o evento");
    }
  };

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card
        className="shadow-sm"
        style={{ maxWidth: "600px", width: "100%" }}
      >
        <Card.Body className="p-4">

          <h3 className="text-center mb-4">Condicións legais</h3>

          <div className="mb-4">
            <ul className="ps-3">
              <li>A páxina web non cobra ningún gasto de xestión.</li>
              <li>
                O organizador responsabilízase de ter seguro e do que poida
                ocorrer no evento. A páxina exímese de responsabilidade.
              </li>
              <li>
                En caso de cancelación, o diñeiro recadado devolverase ao espectador.
              </li>
              <li>
                No caso de que o evento teña un prezo, o importe recadado poderá solicitarse a partir das 00:00 horas
                do día seguinte ao evento.
              </li>
              <li>
                A páxina resérvase o dereito de buscar patrocinadores para o
                evento e quedar coas ganancias.
              </li>
            </ul>
          </div>

          <Form>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Lin e acepto as condicións legais"
                checked={aceptacionCondiciones}
                onChange={(e) =>
                  setAceptacionCondiciones(e.target.checked)
                }
              />
            </Form.Group>

            {error && (
              <div className="text-danger mb-3">{error}</div>
            )}

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
                Crear evento
              </Button>
            </div>
          </Form>

        </Card.Body>
      </Card>
    </Container>
  );
};

export default CondicionesLegales;
