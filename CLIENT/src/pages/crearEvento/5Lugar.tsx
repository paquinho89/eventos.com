import React, { useEffect, useRef, useState } from "react";
import { Button, Container, Card, Form } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { OutletContext } from "./0ElementoPadre";
import { GeocoderAutocomplete } from "@geoapify/geocoder-autocomplete";
import { FaArrowLeft } from "react-icons/fa";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import "../../estilos/Botones.css";

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
  const [inputValue, setInputValue] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const navigate = useNavigate();

  const formularioIncompleto = !selectedPlace || (!evento?.lugar?.trim() && !inputValue.trim());

  // Debug
  useEffect(() => {
    console.log("🔍 Debug:", {
      selectedPlace,
      lugarEvento: evento?.lugar,
      inputValue,
      formularioIncompleto,
    });
  }, [selectedPlace, evento?.lugar, inputValue, formularioIncompleto]);

  /* ================================
     SINCRONIZACIÓN CON CONTEXTO
  ================================== */

  useEffect(() => {
    if (evento) {
      if (evento.lugar && !inputValue) {
        setInputValue(evento.lugar);
      }
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

    const currentLugar = inputValue.trim() || input?.value.trim() || "";
    const currentSelectedPlace = selectedPlace || evento?.ubicacion || "";

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
      console.log("🎯 Feature completa:", feature);
      console.log("🎯 Properties:", feature.properties);
      
      const nomeLugar = feature.properties.name || feature.properties.formatted || "";
      console.log("✅ Autocomplete select:", nomeLugar);

      setInputValue(nomeLugar);

      setEvento((prev) => ({
        ...prev,
        lugar: nomeLugar,
      }));
    });

    // Escuchar cambios en el input
    const input = containerRef.current?.querySelector("input") as HTMLInputElement | null;
    if (input) {
      const handleInput = () => {
        console.log("📝 Input changed:", input.value);
        setInputValue(input.value);
      };
      input.addEventListener("input", handleInput);
      
      return () => {
        input.removeEventListener("input", handleInput);
      };
    }
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
              {showManualInput ? "Introduce o lugar de forma manual" : "Buscar lugar"}
            </label>

            {!showManualInput ? (
              <>
                <div
                  ref={containerRef}
                  style={{
                    width: "100%",
                    position: "relative",
                    zIndex: 1000,
                  }}
                />
                <div className="mt-2">
                  <button
                    className="badge-prezo badge-prezo--clickable"
                    onClick={() => setShowManualInput(true)}
                    type="button"
                  >
                    Non atopa o seu lugar?
                  </button>
                </div>
              </>
            ) : (
              <Form.Control
                type="text"
                placeholder="Introduzca o lugar do evento"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            )}
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
              <FaArrowLeft className="me-2" />
              Volver
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
