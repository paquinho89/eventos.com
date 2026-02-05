import React, { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
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
  const [lugar,setLugar] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!selectedPlace) {
      alert("Por favor, selecciona o tipo de lugar");
      return;
    }

    if (!lugar) {
      alert("Por favor, selecciona o lugar onde vas a realizar o evento");
      return;
    }

    setEvento({
      ...evento,
      lugar: lugar,
      ubicacion: selectedPlace,
    });

    navigate("/crear-evento/entradas"); // Cambia pola ruta do seguinte paso
  };

  useEffect(() => {
    if (!containerRef.current || initialized.current) return; // ✅ Evita inicializar dúas veces
    initialized.current = true;

    const options: any = {
      placeholder: "Buscar o lugar onde vai ter lugar o evento...",
      limit: 5,
      lang: "es",
      filterByCountryCode: ["es"],
      types: ["city", "town", "village", "amenity"],
    };

    const autocomplete = new GeocoderAutocomplete(
      containerRef.current,
      "",
      options
    );

    autocomplete.on("select", (feature: any) => {
      const nomeLugar = feature.properties.name || "";
      const categories = feature.properties.categories || [];
      const normalizar = (t: string) =>
        t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      const esAuditorio =
        categories.includes("entertainment") ||
        normalizar(nomeLugar).includes("auditorio");

      setLugar(nomeLugar);

      setEvento((prev) => ({
        ...prev,
        lugar: nomeLugar,
        esAuditorio,
      }));
      });
  }, []);

  return (
    <>
      <div ref={containerRef} style={{ maxWidth: 400, marginBottom: 20 }} />
        <div className="mb-3">
          <Button
              variant="link"
              className="p-0 text-decoration-none"
              onClick={() => navigate(-1)} // Volve ao paso anterior
          >
              ← Volver
        </Button>
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

export default LugarPaso;
