import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import AuditorioSelectorVerin from "../planoAuditorios/auditorioBotones/auditorioVerin";
import AuditorioSelectorOurense from "../planoAuditorios/auditorioBotones/auditorioOurense";
import MainNavbar from "../componentes/NavBar";
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaUsers, FaEuroSign, FaUniversity, FaImage } from "react-icons/fa";


interface Evento {
  id: number;
  imaxe_evento?: string | null;
  nome_evento: string;
  descripcion_evento?: string;
  data_evento: string;
  localizacion: string;
  entradas_venta: number;
  entradas_reservadas?: number;
  entradas_vendidas?: number;
  prezo_evento?: number;
  numero_iban?: string | null;
  evento_cancelado?: boolean;
  xustificacion_cancelacion?: string | null;
}

export default function EventoDetalle() {
  const { id } = useParams<{ id: string }>();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [aforoHabilitado, setAforoHabilitado] = useState<number | null>(null);
  const [editFecha, setEditFecha] = useState("");
  const [editHora, setEditHora] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelConfirmText, setCancelConfirmText] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState({
    nome_evento: "",
    descripcion_evento: "",
    data_evento: "",
    localizacion: "",
    prezo_evento: "",
    numero_iban: "",
    imaxe_evento: "",
  });
  const navigate = useNavigate();

  const fetchEvento = async (silent = false) => {
    if (!id) return;
    if (!silent) {
      setLoading(true);
    }
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
      if (!silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchEvento();
  }, [id]);

  if (loading) return <div className="container py-4">Cargando evento…</div>;
  if (error) return <div className="container py-4 text-danger">{error}</div>;
  if (!evento) return <div className="container py-4">Evento non encontrado</div>;

  
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

  // Primeira letra en maiúscula
  const dataCapitalizada =
    data.charAt(0).toUpperCase() + data.slice(1);

    return `${dataCapitalizada} ás ${hora}`;
  };
  
  const dataFormato = formatDataCompleta(evento.data_evento);
  const editDataPreview = editFecha && editHora
    ? formatDataCompleta(`${editFecha}T${editHora}:00`)
    : formatDataCompleta(form.data_evento || evento.data_evento);

  const img = evento.imaxe_evento
    ? evento.imaxe_evento.startsWith("http")
      ? evento.imaxe_evento
      : `http://localhost:8000${evento.imaxe_evento}`
    : null;

  const editImg = form.imaxe_evento
    ? form.imaxe_evento.startsWith("http")
      ? form.imaxe_evento
      : `http://localhost:8000${form.imaxe_evento}`
    : null;

  const startEdit = () => {
    setForm({
      nome_evento: evento.nome_evento || "",
      descripcion_evento: evento.descripcion_evento || "",
      data_evento: evento.data_evento || "",
      localizacion: evento.localizacion || "",
      prezo_evento: evento.prezo_evento != null ? String(evento.prezo_evento) : "",
      numero_iban: evento.numero_iban || "",
      imaxe_evento: evento.imaxe_evento || "",
    });
    setImageFileName(evento.imaxe_evento ? evento.imaxe_evento.split("/").pop() || "" : "");
    setImagePreviewUrl(null);
    setImageFile(null);
    setIsEditing(true);
  };
  const normalizar = (t: string) =>
    t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const lugarKey = normalizar(evento.localizacion);

  const auditorios = [
    {
      ciudad: "verin",
      componente: AuditorioSelectorVerin,
    },
    {
      ciudad: "ourense",
      componente: AuditorioSelectorOurense,
    },
  ];

  const AuditorioComponente =
  lugarKey.includes("auditorio")
    ? auditorios.find((a) => lugarKey.includes(a.ciudad))?.componente
    : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFileName(file.name);
    setImagePreviewUrl(URL.createObjectURL(file));
    setImageFile(file);
  };

  const saveEdit = async () => {
    try {
      const token = localStorage.getItem('access_token');
      let resp: Response;

      if (imageFile) {
        const formData = new FormData();
        formData.append("numero_iban", form.numero_iban);
        formData.append("descripcion_evento", form.descripcion_evento);
        formData.append("imaxe_evento", imageFile);

        resp = await fetch(`http://localhost:8000/crear-eventos/${id}/`, {
          method: 'PATCH',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: formData,
        });
      } else {
        const payload: any = {
          numero_iban: form.numero_iban,
          descripcion_evento: form.descripcion_evento,
        };

        resp = await fetch(`http://localhost:8000/crear-eventos/${id}/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        });
      }
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

  const deleteEvento = () => {
    setShowCancelModal(true);
    setCancelReason("");
    setCancelConfirmText("");
  };

  const confirmCancelEvento = async () => {
    if (cancelConfirmText.toLowerCase() !== "cancelar evento") {
      alert("Por favor, escribe 'Cancelar evento' para confirmar");
      return;
    }

    if (!cancelReason) {
      alert("Por favor, selecciona una razón para cancelar");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const resp = await fetch(`http://localhost:8000/crear-eventos/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ razon: cancelReason }),
      });
      if (resp.status !== 204) throw new Error("Erro ao cancelar evento");
      alert("Evento cancelado correctamente");
      setShowCancelModal(false);
      navigate("/panel-organizador");
    } catch (e) {
      console.error(e);
      alert("Erro ao cancelar o evento");
    }
  };

  return (
    <>
    <MainNavbar />
      <div className="container py-4">
        <div className="card shadow-sm">
          <div className="p-3">
            <div className="d-flex align-items-start pb-2 mb-3">
              <Button
                className="boton-avance me-3"
                onClick={() => navigate(-1)}
              >
                ← Volver
              </Button>
              <h2 className="m-0 flex-grow-1 text-center">
                {evento.nome_evento}
              </h2>
              {/* Espaciador para equilibrar o botón */}
              <div style={{ width: "100px" }}></div>
            </div>
            <p className="text-muted text-center small mt-1 mb-0">
              *No seguinte mapa do <strong>{evento.localizacion}</strong> podes reservar as túas entradas.
            </p>
          {AuditorioComponente && (
          <AuditorioComponente
            eventoId={evento.id}
            onZonaClick={(zona) => {
              console.log("Zona seleccionada:", zona);
            }}
            onEntradasUpdate={() => fetchEvento(true)}
            onAforoHabilitadoChange={setAforoHabilitado}
          />
        )}
        </div>
          <div className="card-body">
            {!isEditing ? (
              <>
                 <p><FaCalendarAlt className="me-1" />
                  {dataFormato}
                  </p>
                <p><FaMapMarkerAlt className="me-1" /> {evento.localizacion}</p>

                {/* Barra visual de estado das entradas */}
                <div className="mb-4 mt-4">
                  <h5 className="mb-3">Estado das entradas</h5>
                  
                  {(() => {
                    const aforoTotal = evento.entradas_venta || 0;
                    const aforoHab = aforoHabilitado ?? 0;
                    const vendidas = evento.entradas_vendidas ?? 0;
                    const reservadas = evento.entradas_reservadas ?? 0;
                    const disponibles = Math.max(0, aforoHab - vendidas - reservadas);
                    const inactivas = Math.max(0, aforoTotal - aforoHab);

                    const pctVendidas = aforoTotal > 0 ? (vendidas / aforoTotal) * 100 : 0;
                    const pctReservadas = aforoTotal > 0 ? (reservadas / aforoTotal) * 100 : 0;
                    const pctDisponibles = aforoTotal > 0 ? (disponibles / aforoTotal) * 100 : 0;
                    const pctInactivas = aforoTotal > 0 ? (inactivas / aforoTotal) * 100 : 0;

                    return (
                      <>
                        {/* Barra horizontal */}
                        <div
                          className="d-flex w-100 mb-3"
                          style={{
                            height: "40px",
                            borderRadius: "8px",
                            overflow: "hidden",
                            border: "1px solid #ddd",
                          }}
                        >
                          {/* Vendidas - Verde */}
                          {pctVendidas > 0 && (
                            <div
                              style={{
                                width: `${pctVendidas}%`,
                                backgroundColor: "#28a745",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontSize: "0.85rem",
                                fontWeight: "bold",
                              }}
                              title={`Vendidas: ${vendidas}`}
                            >
                              {pctVendidas > 8 && vendidas}
                            </div>
                          )}

                          {/* Reservadas - Amarelo */}
                          {pctReservadas > 0 && (
                            <div
                              style={{
                                width: `${pctReservadas}%`,
                                backgroundColor: "#ffc107",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#333",
                                fontSize: "0.85rem",
                                fontWeight: "bold",
                              }}
                              title={`Reservadas: ${reservadas}`}
                            >
                              {pctReservadas > 8 && reservadas}
                            </div>
                          )}

                          {/* Disponibles - Azul */}
                          {pctDisponibles > 0 && (
                            <div
                              style={{
                                width: `${pctDisponibles}%`,
                                backgroundColor: "#007bff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontSize: "0.85rem",
                                fontWeight: "bold",
                              }}
                              title={`Disponibles: ${disponibles}`}
                            >
                              {pctDisponibles > 8 && disponibles}
                            </div>
                          )}

                          {/* Inactivas - Gris */}
                          {pctInactivas > 0 && (
                            <div
                              style={{
                                width: `${pctInactivas}%`,
                                backgroundColor: "#6c757d",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontSize: "0.85rem",
                                fontWeight: "bold",
                              }}
                              title={`Inactivas: ${inactivas}`}
                            >
                              {pctInactivas > 8 && inactivas}
                            </div>
                          )}
                        </div>

                        {/* Legenda con datos */}
                        <div className="row g-2">
                          <div className="col-6 col-md-3">
                            <div className="d-flex align-items-center">
                              <div
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  backgroundColor: "#28a745",
                                  borderRadius: "4px",
                                  marginRight: "8px",
                                }}
                              />
                              <div>
                                <small className="text-muted d-block">Vendidas</small>
                                <strong>{vendidas}</strong>
                              </div>
                            </div>
                          </div>
                          <div className="col-6 col-md-3">
                            <div className="d-flex align-items-center">
                              <div
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  backgroundColor: "#ffc107",
                                  borderRadius: "4px",
                                  marginRight: "8px",
                                }}
                              />
                              <div>
                                <small className="text-muted d-block">Reservadas</small>
                                <strong>{reservadas}</strong>
                              </div>
                            </div>
                          </div>
                          <div className="col-6 col-md-3">
                            <div className="d-flex align-items-center">
                              <div
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  backgroundColor: "#007bff",
                                  borderRadius: "4px",
                                  marginRight: "8px",
                                }}
                              />
                              <div>
                                <small className="text-muted d-block">Disponibles</small>
                                <strong>{disponibles}</strong>
                              </div>
                            </div>
                          </div>
                          <div className="col-6 col-md-3">
                            <div className="d-flex align-items-center">
                              <div
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  backgroundColor: "#6c757d",
                                  borderRadius: "4px",
                                  marginRight: "8px",
                                }}
                              />
                              <div>
                                <small className="text-muted d-block">Inactivas</small>
                                <strong>{inactivas}</strong>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Totales */}
                        <div className="mt-3 pt-3 border-top">
                          <div className="row">
                            <div className="col-6">
                              <small className="text-muted">Aforo total:</small>
                              <strong className="ms-2">{aforoTotal}</strong>
                            </div>
                            <div className="col-6">
                              <small className="text-muted">Aforo habilitado:</small>
                              <strong className="ms-2">{aforoHab}</strong>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <p><FaUsers className="me-1" />Diñeiro recadado: {evento.prezo_evento != null ? (Number(evento.prezo_evento) * (evento.entradas_vendidas ?? 0)).toFixed(2) : "0.00"} €</p>
                {evento.prezo_evento != null && <p><FaEuroSign className="me-1" />Prezo Evento:{evento.prezo_evento} €</p>}
                <p><FaUniversity className="me-1" />Número conta bancaria: {evento.numero_iban ?? "-"}</p>
                {evento.descripcion_evento && (
                  <div>
                    <h5>Descripción:</h5>
                    <p>{evento.descripcion_evento}</p>
                  </div>
                )}
                {evento.imaxe_evento && (
                  <p><FaImage className="me-1" />Imaxe: {evento.imaxe_evento.split("/").pop()}</p>
                )}
                
                <div className="mt-3 d-flex">
                  <button className="reserva-entrada-btn me-2" onClick={startEdit}>Editar evento</button>
                  <button className="btn btn-danger" onClick={deleteEvento}>Cancelar evento</button>
                </div>
              </>
            ) : (
              <div>
                <div className="mb-3">
                  <label className="form-label">Número de conta</label>
                  <input name="numero_iban" value={form.numero_iban} onChange={handleChange} className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea name="descripcion_evento" value={form.descripcion_evento} onChange={handleChange} className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Imaxe</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      value={imageFileName}
                      readOnly
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Buscar
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImagePick}
                    style={{ display: "none" }}
                  />
                  {(imagePreviewUrl || editImg) && (
                    <img
                      src={imagePreviewUrl || editImg || ""}
                      alt={form.nome_evento}
                      style={{ marginTop: 8, maxWidth: 160, borderRadius: 6 }}
                    />
                  )}
                </div>
                <div className="d-flex gap-2">
                  <button className="reserva-entrada-btn me-2" onClick={saveEdit}>Gardar Cambios</button>
                  <button className="volver-btn" onClick={() => setIsEditing(false)}>Cancelar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de cancelación de evento */}
      {showCancelModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">⚠️ Cancelar evento</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowCancelModal(false)}
                />
              </div>
              <div className="modal-body">
                <p className="mb-3">
                  <strong>Está a punto de cancelar este evento.</strong>
                </p>
                <div className="alert alert-warning mb-3">
                  O importe das entradas vendidas será devolto aos asistentes.
                </div>

                <div className="mb-3">
                  <label className="form-label">Razón de cancelación</label>
                  <select
                    className="form-select"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                  >
                    <option value="">Selecciona una razón</option>
                    <option value="Falta de asistentes">Falta de asistentes</option>
                    <option value="Problema de saúde">Problema de saúde</option>
                    <option value="Problemas técnicos">Problemas técnicos</option>
                    <option value="Falta de artista">Falta de artista</option>
                    <option value="Imposibilidade do local">Imposibilidade do local</option>
                    <option value="Cambio de planes">Cambio de planes</option>
                    <option value="Outra">Outra</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Escribe <strong>"Cancelar evento"</strong> para confirmar
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Cancelar evento"
                    value={cancelConfirmText}
                    onChange={(e) => setCancelConfirmText(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCancelModal(false)}
                >
                  Voltar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmCancelEvento}
                  disabled={cancelConfirmText.toLowerCase() !== "cancelar evento"}
                >
                  Cancelar evento definitivamente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

