import { useState } from "react";

export interface Lugar {
  id: string;
  name: string;
  lat: number | null;
  lon: number | null;
  tags: string;
}

interface Props {
  onSelect?: (lugar: Lugar) => void;
}

export default function BuscadorOverpassGalicia({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<Lugar[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscar = async () => {
    if (query.trim().length < 2) return;

    setLoading(true);
    setError(null);
    setResultados([]);

    try {
      const safeQuery = query.replace(/"/g, '\\"');

      const overpassQuery = `
        [out:json][timeout:25];
        area["name"="Galicia"]["admin_level"="4"]->.galicia;

        (
          node(area.galicia)["name"~"${safeQuery}",i];
          way(area.galicia)["name"~"${safeQuery}",i];
          relation(area.galicia)["name"~"${safeQuery}",i];
        );

        out center tags 20;
      `;

      const res = await fetch(
        "https://overpass-api.de/api/interpreter",
        {
          method: "POST",
          body: overpassQuery,
        }
      );

      const data = await res.json();

      const parsed: Lugar[] = data.elements
        .filter((el: any) => el.tags?.name)
        .map((el: any) => ({
          id: `${el.type}-${el.id}`,
          name: el.tags.name,
          lat: el.lat ?? el.center?.lat ?? null,
          lon: el.lon ?? el.center?.lon ?? null,
          tags: Object.keys(el.tags).join(", "),
        }));

      setResultados(parsed);
    } catch (e) {
      console.error(e);
      setError("Erro ao buscar en Overpass");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: 420, display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Input */}
      <input
        type="text"
        placeholder="Auditorio, rúa, recinto..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: 10 }}
      />

      {/* Botón */}
      <button
        onClick={buscar}
        disabled={loading}
        style={{ padding: 10, cursor: "pointer" }}
      >
        {loading ? "Buscando..." : "Buscar"}
      </button>

      {/* Erro */}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* Resultados */}
      {resultados.length > 0 && (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            border: "1px solid #ccc",
            maxHeight: 300,
            overflowY: "auto",
          }}
        >
          {resultados.map((l) => (
            <li
              key={l.id}
              style={{
                padding: 10,
                borderBottom: "1px solid #eee",
                cursor: "pointer",
              }}
              onClick={() => onSelect?.(l)}
            >
              <strong>{l.name}</strong>
              <br />
              <small>{l.tags}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
