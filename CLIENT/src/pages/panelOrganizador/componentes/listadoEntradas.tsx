import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import MainNavbar from "../../componentes/NavBar";
import { FaArrowLeft } from "react-icons/fa";

interface EntradaData {
  zona: string;
  fila: number;
  butaca: number;
  estado: string;
}

export default function ListadoEntradas() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entradasData, setEntradasData] = useState<EntradaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterZona, setFilterZona] = useState<string>("");
  const [filterEstado, setFilterEstado] = useState<string>("");
  const [eventoNome, setEventoNome] = useState<string>("");

  useEffect(() => {
    fetchEntradasData();
  }, [id]);

  useEffect(() => {
    // Cambiar o título da páxina co nome do evento para a impresión
    if (eventoNome) {
      const originalTitle = document.title;
      document.title = `Listado Butacas - ${eventoNome}`;
      
      // Restaurar o título orixinal ao desmontar
      return () => {
        document.title = originalTitle;
      };
    }
  }, [eventoNome]);

  const fetchEntradasData = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("access_token");
      
      // Obter datos do evento para o nome
      const respEvento = await fetch(`http://localhost:8000/crear-eventos/${id}/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (respEvento.ok) {
        const dataEvento = await respEvento.json();
        setEventoNome(dataEvento.nome_evento);
      }

      // Obter entradas
      const zonas = ["anfiteatro", "esquerda", "central", "dereita"];
      const allEntradas: EntradaData[] = [];

      for (const zona of zonas) {
        try {
          // Obter reservas
          const respReservas = await fetch(
            `http://localhost:8000/crear-eventos/${id}/reservas/?zona=${zona}`,
            { headers: token ? { Authorization: `Bearer ${token}` } : {} }
          );
          const dataReservas = respReservas.ok ? await respReservas.json() : { reservas: [] };

          // Obter miñas reservas
          const respMisReservas = await fetch(
            `http://localhost:8000/crear-eventos/${id}/mis-reservas/?zona=${zona}`,
            { headers: token ? { Authorization: `Bearer ${token}` } : {} }
          );
          const dataMisReservas = respMisReservas.ok ? await respMisReservas.json() : { mis_reservas: [] };

          // Obter entradas vendidas
          const respVendidas = await fetch(
            `http://localhost:8000/crear-eventos/${id}/reservas-vendidas/?zona=${zona}`,
            { headers: token ? { Authorization: `Bearer ${token}` } : {} }
          );
          const dataVendidas = respVendidas.ok ? await respVendidas.json() : { reservas: [] };

          // Combinar todas as reservas
          const todasReservas = [
            ...(dataReservas.reservas || []),
            ...(dataMisReservas.mis_reservas || [])
          ];

          // Construir entrada para cada butaca
          todasReservas.forEach((asento: any) => {
            allEntradas.push({
              zona: zona.charAt(0).toUpperCase() + zona.slice(1),
              fila: asento.row,
              butaca: asento.seat,
              estado: "Reservada"
            });
          });

          // Agregar entradas vendidas
          (dataVendidas.reservas || []).forEach((asento: any) => {
            allEntradas.push({
              zona: zona.charAt(0).toUpperCase() + zona.slice(1),
              fila: asento.row,
              butaca: asento.seat,
              estado: "Vendida"
            });
          });
        } catch (err) {
          console.error(`Error fetching data for zona ${zona}:`, err);
        }
      }

      setEntradasData(allEntradas.sort((a, b) => {
        if (a.zona !== b.zona) return a.zona.localeCompare(b.zona);
        if (a.fila !== b.fila) return a.fila - b.fila;
        return a.butaca - b.butaca;
      }));
    } catch (e: any) {
      console.error("Error fetching entradas data:", e);
      setError("Erro ao cargar datos de entradas");
    } finally {
      setLoading(false);
    }
  };

  const entradasFiltradas = entradasData.filter((entrada) => {
    const zonaMatch = filterZona === "" || entrada.zona === filterZona;
    const estadoMatch = filterEstado === "" || entrada.estado === filterEstado;
    return zonaMatch && estadoMatch;
  });

  const zonasDisponibles = Array.from(new Set(entradasData.map((e) => e.zona)));

  return (
    <>
      <style>{`
        @media print {
          @page {
            margin: 0;
            size: auto;
          }
          .no-print {
            display: none !important;
          }
          .d-print-block {
            display: block !important;
          }
          body {
            margin: 15mm 10mm;
            padding: 0;
          }
          .container {
            max-width: 100% !important;
            padding: 0 !important;
          }
          .card {
            border: none !important;
            box-shadow: none !important;
          }
          .table {
            page-break-inside: auto;
          }
          .table tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          .print-header {
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #333;
          }
        }
      `}</style>
      <div className="no-print">
        <MainNavbar />
      </div>
      <div className="container py-4">
        <div className="card shadow-sm">
          <div className="card-header bg-white border-0 no-print">
            <div className="d-flex align-items-center justify-content-between">
              <Button
                className="boton-avance"
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft className="me-2" />
                Volver
              </Button>
              <h2 className="m-0 text-center flex-grow-1" style={{ fontWeight: 700 }}>
                Listado das Butacas
              </h2>
              <button
                type="button"
                className="reserva-entrada-btn"
                onClick={() => window.print()}
              >
                Imprimir
              </button>
            </div>
            {eventoNome && (
              <p className="text-center text-muted mb-0 mt-2">
                Evento: <strong>{eventoNome}</strong>
              </p>
            )}
          </div>

          <div className="card-body">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2">Cargando datos de entradas...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            ) : (
              <>
                {/* Filtros */}
                <div className="mb-4 no-print">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Filtrar por Zona</label>
                      <select
                        className="form-select"
                        value={filterZona}
                        onChange={(e) => setFilterZona(e.target.value)}
                      >
                        <option value="">Todas as zonas</option>
                        {zonasDisponibles.map((zona) => (
                          <option key={zona} value={zona}>
                            {zona}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Filtrar por Estado</label>
                      <select
                        className="form-select"
                        value={filterEstado}
                        onChange={(e) => setFilterEstado(e.target.value)}
                      >
                        <option value="">Todos os estados</option>
                        <option value="Reservada">Reservada</option>
                        <option value="Vendida">Vendida</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Resumo de entradas */}
                <div className="mb-3 p-3 bg-light rounded no-print">
                  <div className="row text-center">
                    <div className="col-md-6">
                      <h5 className="mb-1">{entradasFiltradas.filter(e => e.estado === "Vendida").length}</h5>
                      <small style={{ color: "#000", fontWeight: 600 }}>Vendidas</small>
                    </div>
                    <div className="col-md-6">
                      <h5 className="mb-1">{entradasFiltradas.filter(e => e.estado === "Reservada").length}</h5>
                      <small style={{ color: "#000", fontWeight: 600 }}>Reservadas</small>
                    </div>
                  </div>
                </div>

                {/* Información de impresión */}
                <div className="d-none d-print-block print-header">
                  {eventoNome && (
                    <p className="mb-0" style={{ fontSize: "16px", fontWeight: 600 }}>
                      Evento: {eventoNome}
                    </p>
                  )}
                </div>

                {/* Táboa de entradas */}
                <div style={{ overflowX: "auto" }}>
                  <table className="table table-striped table-bordered table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Zona</th>
                        <th>Fila</th>
                        <th>Butaca</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entradasFiltradas.length > 0 ? (
                        entradasFiltradas.map((entrada, idx) => (
                          <tr key={idx}>
                            <td>{entrada.zona}</td>
                            <td>{entrada.fila}</td>
                            <td>{entrada.butaca}</td>
                            <td
                              style={{
                                borderLeft: entrada.estado === "Vendida" ? "4px solid #198754" : entrada.estado === "Reservada" ? "4px solid #ff0093" : "4px solid transparent"
                              }}
                            >
                              {entrada.estado}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center text-muted py-4">
                            Non hai entradas xestionadas
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Botóns de acción */}
                <div className="d-flex justify-content-between gap-2 mt-3 no-print">
                  <button
                    type="button"
                    className="boton-avance"
                    onClick={() => navigate(-1)}
                  >
                    <FaArrowLeft className="me-2" />
                    Volver
                  </button>
                  <button
                    type="button"
                    className="reserva-entrada-btn"
                    onClick={() => window.print()}
                  >
                    Imprimir
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
