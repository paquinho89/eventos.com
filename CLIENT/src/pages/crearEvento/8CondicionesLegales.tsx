import React, { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import type { OutletContext } from "../crearEvento/0ElementoPadre";

const CondicionesLegales: React.FC = () => {
  const { evento, setEvento } = useOutletContext<OutletContext>();
  const [aceptacionCondiciones, setAceptacionCondiciones] = useState<boolean>(evento.condicionesConfirmacion || false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!aceptacionCondiciones) {
      setError("Por favor, acepta y lea las condiciones legales");
      return;
    }
    setError("");

    // Primeiro gardamos no estado pai
    setEvento({ ...evento, condicionesConfirmacion: aceptacionCondiciones });

    // Creamos o FormData co valor actualizado do checkbox
    const formData = new FormData();
    formData.append("tipo_evento", evento.tipo);
    formData.append("nome_evento", evento.tituloEvento);
    formData.append("descripcion_evento", evento.descripcionEvento);
    if (evento.imagen) formData.append("imaxe_evento", evento.imagen);
    formData.append("data_evento", evento.fecha); 
    formData.append("localizacion", evento.lugar);
    formData.append("entradas_venta", evento.entradas.toString());
    formData.append("prezo_evento", evento.precio.toString());
    formData.append("numero_iban", evento.iban);
    formData.append(
      "condiciones_confirmacion",
      aceptacionCondiciones ? "true" : "false"
    );

    try {
      const response = await fetch("http://localhost:8000/crear-eventos/", {
        method: "POST",
        body: formData,
        //headers: {
          //Authorization: `Bearer ${token}`, // Se usas autenticación
        //},
      });

      if (!response.ok) throw new Error("Erro ao crear o evento");

      const data = await response.json();
      console.log("Evento creado:", data);
      alert("Evento creado correctamente!");

      // Navegamos **despois** de recibir resposta exitosa
      navigate("/crear-evento/panel-usuario");
    } catch (error) {
      console.error(error);
      alert("Erro ao crear o evento");
    }
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
          <li>El dinero recaudado en el evento se podrá solicitar a partir de las 00:00 horas del día siguiente al evento</li>
          <li>La página web se reserva el derecho de buscar patrocinadores para el evento y quedarse con las ganancias</li>
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
        Crear Evento
      </Button>
    </div>
  );
};

export default CondicionesLegales;
