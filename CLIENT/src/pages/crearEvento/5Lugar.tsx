import React, { useEffect, useRef, useState } from "react";
import { Button, Container, Card } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { OutletContext } from "./0ElementoPadre";
import { GeocoderAutocomplete } from "@geoapify/geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";

const LugarPaso: React.FC = () => {
  const PLACE_TYPES = [
    "Auditorio",
    "Bar/Restaurante",
    "Calle",
    "Estadio",
    "Local privado",
    "Plaza pública",
    "Polideportivo",
    "Sala de conciertos",
    "Teatro",
    "Otros",
  ];

  const { evento, setEvento } = useOutletContext<OutletContext>();
  const [selectedPlace, setSelectedPlace] = useState("");
  const [lugar, setLugar] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const navigate = useNavigate();

    const formularioIncompleto = !selectedPlace || !lugar;

  /* ================================
     SINCRONIZACIÓN CON CONTEXTO
  ================================== */

  useEffect(() => {
    if (evento) {
      if (evento.lugar && !lugar) setLugar(evento.lugar);
      if (evento.ubicacion && !selectedPlace)
        setSelectedPlace(evento.ubicacion);
    }
  }, [evento]);

  useEffect(() => {
    const input = containerRef.current?.querySelector(
      "input"
    ) as HTMLInputElement | null;

    if (!input) return;

    if (evento?.lugar) {
      input.value = evento.lugar;
    }
  }, [evento]);

  /* ================================
     SUBMIT
  ================================== */

  const handleSubmit = () => {
    const input = containerRef.current?.querySelector(
      "input"
    ) as HTMLInputElement | null;

    const currentLugar =
      lugar || evento?.lugar || input?.value || "";
    const currentSelectedPlace =
      selectedPlace || evento?.ubicacion || "";

    if (!currentSelectedPlace) {
      alert("Por favor, selecciona o tipo de lugar");
      return;
    }

    if (!currentLugar) {
      alert(
        "Por favor, selecciona o lugar onde vas a realizar o evento"
      );
      return;
    }

    setEvento({
      ...evento,
      lugar: currentLugar,
      ubicacion: currentSelectedPlace,
    });

    navigate("/crear-evento/entradas");
  };

  /* ================================
     INICIALIZAR AUTOCOMPLETE
  ================================== */

  useEffect(() => {
    if (!containerRef.current || initialized.current) return;
    initialized.current = true;

    const autocomplete = new GeocoderAutocomplete(
      containerRef.current,
      import.meta.env.VITE_GEOAPIFY_AUTOCOMPLETE_APP_API_KEY!,
      {
        placeholder:
          "Buscar o lugar onde vai ter lugar o evento...",
        limit: 5,
        lang: "es",
        filterByCountryCode: ["es"],
        types: ["city", "town", "village", "amenity"],
      } as any
    );

    autocomplete.on("select", (feature: any) => {
      const nomeLugar = feature.properties.name || "";

      setLugar(nomeLugar);

      setEvento((prev) => ({
        ...prev,
        lugar: nomeLugar,
      }));
    });
  }, []);

  /* ================================
     RENDER
  ================================== */

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card
        className="shadow-sm"
        style={{
          maxWidth: "600px",
          width: "100%",
          overflow: "visible", // 🔥 CLAVE
        }}
      >
        <Card.Body className="p-4">
          <h3 className="text-center mb-4">
            Lugar do evento
          </h3>

          {/* AUTOCOMPLETE */}
          <div className="mb-4">
            <label className="form-label">
              Buscar lugar
            </label>

            <div
              ref={containerRef}
              style={{
                width: "100%",
                position: "relative",
                zIndex: 1000,
              }}
            />
          </div>

          {/* SELECT TIPO LUGAR */}
          <div className="mb-3">
            <label
              htmlFor="place-select"
              className="form-label"
            >
              Tipo de lugar
            </label>

            <select
              id="place-select"
              className="form-select"
              value={selectedPlace}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedPlace(val);
                setEvento((prev) => ({
                  ...prev,
                  ubicacion: val,
                }));
              }}
            >
              <option value="">
                Selecciona unha opción
              </option>

              {PLACE_TYPES.map((place) => (
                <option key={place} value={place}>
                  {place}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3 mt-4 d-flex justify-content-between align-items-center">
            <Button
              className="boton-avance"
              onClick={() => navigate(-1)}
            >
              ← Volver
            </Button>

            <Button
              className="reserva-entrada-btn"
              disabled={formularioIncompleto}
              onClick={handleSubmit}
            >
              Continuar
            </Button>
          </div>
          

        </Card.Body>
      </Card>
    </Container>
  );
};

export default LugarPaso;
