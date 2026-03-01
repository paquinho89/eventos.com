import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import MainNavbar from "../componentes/NavBar";
import { FaArrowLeft, FaEuroSign } from "react-icons/fa";

interface Evento {
  id: number;
  nome_evento: string;
  data_evento: string;
  localizacion: string;
  entradas_vendidas?: number;
  prezo_evento?: number;
  numero_iban?: string | null;
}

export default function CobroEvento() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const resp = await fetch(`http://localhost:8000/crear-eventos/${id}/`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!resp.ok) throw new Error("Evento non atopado");
        const data = await resp.json();
        setEvento(data);
      } catch (e: any) {
        setError(e.message || "Erro ao cargar evento");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEvento();
  }, [id]);

  if (loading) return <div className="container py-4">Cargando evento…</div>;
  if (error) return <div className="container py-4 text-danger">{error}</div>;
  if (!evento) return <div className="container py-4">Evento non encontrado</div>;

  const importeTotal = (evento.entradas_vendidas || 0) * (evento.prezo_evento || 0);

  const formatDataCompleta = (dateString: string) => {
    const date = new Date(dateString);
    const data = new Intl.DateTimeFormat("gl-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
    const hora = new Intl.DateTimeFormat("gl-ES", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
    const dataCapitalizada = data.charAt(0).toUpperCase() + data.slice(1);
    return `${dataCapitalizada} ás ${hora}`;
  };

  const dataFormato = formatDataCompleta(evento.data_evento);

  return (
    <>
      <MainNavbar />
      <div className="container py-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="d-flex align-items-center mb-4">
              <h2 className="m-0 flex-grow-1">{evento.nome_evento}</h2>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="fw-bold">Data do evento:</label>
                <p>{dataFormato}</p>
              </div>
              <div className="col-md-6">
                <label className="fw-bold">Localización:</label>
                <p>{evento.localizacion}</p>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="fw-bold">Entradas vendidas:</label>
                <p>{evento.entradas_vendidas || 0}</p>
              </div>
              <div className="col-md-6">
                <label className="fw-bold">Precio por entrada:</label>
                <p>{evento.prezo_evento || 0} €</p>
              </div>
            </div>

            <hr />

            <div className="row">
              <div className="col-md-12">
                <label className="fw-bold h4">Importe Total a Cobrar:</label>
                <div className="p-3" style={{ backgroundColor: "#fff5fa", border: "1px solid #ffccdd", borderRadius: "6px" }}>
                  <h3 className="mb-0">
                    <FaEuroSign className="me-2" />
                    {importeTotal.toFixed(2)} €
                  </h3>
                </div>
              </div>
            </div>

            {evento.numero_iban && (
              <div className="row mt-4">
                <div className="col-md-12">
                  <label className="fw-bold">Número de conta (IBAN):</label>
                  <p className="font-monospace bg-light p-2 rounded">
                    {evento.numero_iban}
                  </p>
                </div>
              </div>
            )}

            <div className="d-flex gap-2 justify-content-between mt-4">
              <Button
                className="cancelar-evento-btn"
                onClick={() => navigate(-1)}
              >
                Volver
              </Button>
              <Button
                className="reserva-entrada-btn"
              >
                Cobrar importe
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
