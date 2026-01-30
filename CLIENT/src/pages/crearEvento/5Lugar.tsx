import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GeocoderAutocomplete } from "@geoapify/geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";

const Lugar: React.FC = () => {
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

  const [selectedPlace, setSelectedPlace] = useState("");
  const [freeCity, setFreeCity] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!freeCity) {
      alert("Por favor, introduce ou selecciona unha cidade");
      return;
    }
    if (!selectedPlace) {
      alert("Por favor, selecciona o tipo de lugar");
      return;
    }

    // Aquí podes gardar os datos no estado global ou context
    console.log("Datos do lugar:", { city: freeCity, placeType: selectedPlace });

    // Avanzamos ao seguinte paso
    navigate("/crear-evento/entradas"); // Cambia pola ruta do seguinte paso
  };

  useEffect(() => {
    if (!containerRef.current || initialized.current) return; // ✅ Evita inicializar dúas veces
    initialized.current = true;

    const options: any = {
      placeholder: "Buscar cidade en España...",
      limit: 5,
      lang: "es",
      filterByCountryCode: ["es"],
      types: ["city", "town", "village"],
    };

    const autocomplete = new GeocoderAutocomplete(
      containerRef.current,
      "",
      options
    );

    autocomplete.on("select", (feature: any) => {
      console.log("Cidade seleccionada:", {
        nome: feature.properties.city || feature.properties.name,
        lat: feature.properties.lat,
        lon: feature.properties.lon,
      });
    });
  }, []);

  return (
    <>
      <div ref={containerRef} style={{ maxWidth: 400, marginBottom: 20 }} />
      {/*Input Libre*/}
      <div style={{ maxWidth: 400, marginBottom: 20 }}>
        <label htmlFor="free-city" style={{ display: "block", marginBottom: 6 }}>
          Cidade (se non atopa o lugar, introdúcea aquí)
        </label>
        <input
          id="free-city"
          type="text"
          value={freeCity}
          onChange={(e) => setFreeCity(e.target.value)}
          placeholder="Se non atopa o lugar, introdúcea aquí"
          style={{ width: "100%", padding: 8 }}
        />
      </div>
      {/* Dropdown */}
      <div style={{ maxWidth: 400 }}>
        <label htmlFor="place-select" style={{ display: "block", marginBottom: 6 }}>
          Tipo de lugar
        </label>
        <select
          id="place-select"
          value={selectedPlace}
          onChange={(e) => setSelectedPlace(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        >
          <option value="">Selecciona unha opción</option>
          {PLACE_TYPES.map((place) => (
            <option key={place} value={place}>
              {place}
            </option>
          ))}
        </select>

        <p style={{ marginTop: 8 }}>
          Seleccionado: <strong>{selectedPlace || "ningún"}</strong>
        </p>
      </div>
      {/* Botón Submit */}
      <button
        onClick={handleSubmit}
        style={{
          padding: "10px 16px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Continuar
      </button>
    </>
  );
};

export default Lugar;
