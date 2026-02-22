import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuditorioSelectorVerin from "../planoAuditorios/auditorioBotones/auditorioVerin";


interface Evento {
  id: number;
  imaxe_evento?: string | null;
  nome_evento: string;
  descripcion_evento?: string;
  data_evento: string;
  localizacion: string;
  entradas_venta: number;
  prezo_evento?: number;
}

export default function EventoDetalle() {
  const { id } = useParams<{ id: string }>();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    nome_evento: "",
    descripcion_evento: "",
    data_evento: "",
    localizacion: "",
    entradas_venta: 0,
    prezo_evento: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    const fetchEvento = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const resp = await fetch(`http://localhost:8000/crear-eventos/${id}/`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!resp.ok) throw new Error("Evento non atopado");
        const data = await resp.json();
        setEvento(data);
      } catch (e: any) {
        console.error(e);
        setError(e.message || "Erro ao cargar evento");
      } finally {
        setLoading(false);
      }
    };
    fetchEvento();
  }, [id]);

  if (loading) return <div className="container py-4">Cargando evento…</div>;
  if (error) return <div className="container py-4 text-danger">{error}</div>;
  if (!evento) return <div className="container py-4">Evento non encontrado</div>;

  const img = evento.imaxe_evento
    ? evento.imaxe_evento.startsWith("http")
      ? evento.imaxe_evento
      : `http://localhost:8000${evento.imaxe_evento}`
    : null;

  const startEdit = () => {
    setForm({
      nome_evento: evento.nome_evento || "",
      descripcion_evento: evento.descripcion_evento || "",
      data_evento: evento.data_evento || "",
      localizacion: evento.localizacion || "",
      entradas_venta: evento.entradas_venta || 0,
      prezo_evento: evento.prezo_evento != null ? String(evento.prezo_evento) : "",
    });
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: name === 'entradas_venta' ? Number(value) : value }));
  };

  const saveEdit = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const payload: any = {
        nome_evento: form.nome_evento,
        descripcion_evento: form.descripcion_evento,
        data_evento: form.data_evento,
        localizacion: form.localizacion,
        entradas_venta: form.entradas_venta,
      };
      if (form.prezo_evento !== '') payload.prezo_evento = form.prezo_evento;

      const resp = await fetch(`http://localhost:8000/crear-eventos/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error('Erro ao gardar cambios');
      const data = await resp.json();
      setEvento(data);
      setIsEditing(false);
      alert('Evento actualizado');
    } catch (e) {
      console.error(e);
      alert('Erro ao actualizar o evento');
    }
  };

  const deleteEvento = async () => {
    if (!window.confirm('¿Seguro que queres eliminar este evento?')) return;
    try {
      const token = localStorage.getItem('access_token');
      const resp = await fetch(`http://localhost:8000/crear-eventos/${id}/`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (resp.status !== 204) throw new Error('Erro ao eliminar');
      alert('Evento eliminado');
      navigate('/panel-organizador');
    } catch (e) {
      console.error(e);
      alert('Erro ao eliminar o evento');
    }
  };

  return (
    <div className="container py-4">
      <button className="btn btn-link mb-3" onClick={() => navigate(-1)}>
        ← Volver
      </button>
      <div className="card shadow-sm">
        <h2 className="mt-4 text-center">
          {evento.localizacion}
        </h2>
        <AuditorioSelectorVerin
        onZonaClick={(zona) => {
          console.log("Zona seleccionada:", zona);
          // Aquí podes abrir o teu modal
        }}
      />
        <div className="card-body">
          {!isEditing ? (
            <>
              <h2>{evento.nome_evento}</h2>
              <p className="text-muted">{new Date(evento.data_evento).toLocaleString()}</p>
              <p><strong>Lugar:</strong> {evento.localizacion}</p>
              <p><strong>Entradas dispoñibles:</strong> {evento.entradas_venta}</p>
              {evento.prezo_evento != null && <p><strong>Prezo:</strong> {evento.prezo_evento} €</p>}
              {evento.descripcion_evento && (
                <div>
                  <h5>Descripción</h5>
                  <p>{evento.descripcion_evento}</p>
                </div>
              )}

              <div className="mt-3">
                <button className="btn btn-primary me-2" onClick={startEdit}>Editar evento</button>
                <button className="btn btn-outline-danger" onClick={deleteEvento}>Eliminar evento</button>
              </div>
            </>
          ) : (
            <div>
              <div className="mb-3">
                <label className="form-label">Título</label>
                <input name="nome_evento" value={form.nome_evento} onChange={handleChange} className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">Data (ISO)</label>
                <input name="data_evento" value={form.data_evento} onChange={handleChange} className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">Lugar</label>
                <input name="localizacion" value={form.localizacion} onChange={handleChange} className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">Entradas dispoñibles</label>
                <input name="entradas_venta" type="number" value={String(form.entradas_venta)} onChange={handleChange} className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">Prezo (€)</label>
                <input name="prezo_evento" value={form.prezo_evento} onChange={handleChange} className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea name="descripcion_evento" value={form.descripcion_evento} onChange={handleChange} className="form-control" />
              </div>
              <div>
                <button className="btn btn-success me-2" onClick={saveEdit}>Gardar</button>
                <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancelar</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
