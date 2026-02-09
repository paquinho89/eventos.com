import { useState, useEffect } from "react";
import TarjetaEvento from "./componentes/tarjetaEvento";

interface Evento {
  id: number;
  imaxe_evento?: string | null;
  nome_evento: string;
  data_evento: string;
  localizacion: string;
  entradas_venta: number;
}

export default function PanelOrganizador() {
  const [view, setView] = useState("dashboard");
  const [allEventos, setAllEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch eventos al montar
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        setLoading(true);
        setError(null);

        const attemptFetch = async () => {
          const token = localStorage.getItem("access_token");
          const resp = await fetch("http://localhost:8000/crear-eventos/", {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          return resp;
        };

        let resp = await attemptFetch();

        if (resp.status === 401) {
          try {
            const refresh = localStorage.getItem('refresh_token');
            if (!refresh) throw new Error('No refresh token');
            
            const r = await fetch('http://localhost:8000/api/token/refresh/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refresh }),
            });
            if (!r.ok) throw new Error('Refresh failed');
            const jr = await r.json();
            
            if (jr.access) {
              localStorage.setItem('access_token', jr.access);
            } else if (jr.access_token) {
              localStorage.setItem('access_token', jr.access_token);
            }
            
            resp = await attemptFetch();
            if (!resp.ok) throw new Error('Erro ao cargar eventos despois refresh');
          } catch (refreshErr) {
            console.error('Token refresh failed', refreshErr);
            setError('Sesión expirada. Por favor vuelve a iniciar sesión.');
            setLoading(false);
            return;
          }
        }

        if (!resp.ok) {
          const text = await resp.text().catch(() => null);
          throw new Error(`Erro ao cargar eventos: ${resp.status}`);
        }
        
        const data = await resp.json();
        setAllEventos(data);
      } catch (e: any) {
        console.error('Error fetching eventos', e);
        setError(e.message || 'Erro ao cargar eventos');
      } finally {
        setLoading(false);
      }
    };
    fetchEventos();
  }, []);

  // Separar eventos activos e pasados
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  const eventosActivos = allEventos.filter((ev) => {
    const dataEvento = new Date(ev.data_evento);
    dataEvento.setHours(0, 0, 0, 0);
    return dataEvento >= hoy;
  });

  const eventosPasados = allEventos.filter((ev) => {
    const dataEvento = new Date(ev.data_evento);
    dataEvento.setHours(0, 0, 0, 0);
    return dataEvento < hoy;
  });

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Panel do Organizador</h1>
        <button
          className="btn btn-outline-secondary"
          onClick={() => setView("settings")}
        >
          ⚙️ Axustes
        </button>
      </div>

      {view === "dashboard" && (
        <div className="row g-4">
          {/* Eventos activos */}
          <div className="col-md-6">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">📅 Eventos activos</h5>
                {loading && <p>Loading…</p>}
                {error && <div className="alert alert-danger">{error}</div>}
                {!loading && !error && (
                  <div className="row">
                    {eventosActivos.length === 0 ? (
                      <p className="col-12">Non hai eventos activos.</p>
                    ) : (
                      eventosActivos.map((ev) => (
                        <div className="col-12 col-md-6 mb-3" key={ev.id}>
                          <TarjetaEvento evento={ev} />
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Eventos pasados */}
          <div className="col-md-6">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">✅ Eventos pasados</h5>
                {loading && <p>Loading…</p>}
                {error && <div className="alert alert-danger">{error}</div>}
                {!loading && !error && (
                  <div className="row">
                    {eventosPasados.length === 0 ? (
                      <p className="col-12">Non hai eventos pasados.</p>
                    ) : (
                      eventosPasados.map((ev) => (
                        <div className="col-12 col-md-6 mb-3" key={ev.id}>
                          <TarjetaEvento evento={ev} />
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {view === "settings" && (
        <div className="row">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h4 className="card-title mb-4">⚙️ Axustes da conta</h4>

                <div className="d-grid gap-2">
                  <button className="btn btn-outline-primary text-start">🌍 Cambiar idioma</button>
                  <button className="btn btn-outline-primary text-start">🔒 Cambiar contrasinal</button>
                  <button className="btn btn-outline-primary text-start">📝 Actualizar información</button>
                  <button className="btn btn-outline-danger text-start">❌ Cancelar conta</button>
                </div>

                <button
                  className="btn btn-link mt-3"
                  onClick={() => setView("dashboard")}
                >
                  ← Volver ao panel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


