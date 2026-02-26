import React, { useState, useEffect } from "react";
import "../../../estilos/BotonesAuditorios.css";
import AuditorioVerinAnfiteatro from "../Planos/auditorioVerin/anfiteatro";
import AuditorioVerinZonaCentral from "../Planos/auditorioVerin/zonaCentral";
import AuditorioVerinLateralDereita from "../Planos/auditorioVerin/zonaLateralDereita";
import AuditorioVerinLateralEsquerda from "../Planos/auditorioVerin/zonaLateralEsquerda";
import { FaTrash } from "react-icons/fa";
import { useAuth } from "../../AuthContext";

const API_BASE_URL = "http://localhost:8000";

type Zona = "anfiteatro" | "esquerda" | "central" | "dereita";
type Variant = "rosa" | "verde";

interface SelectedSeat {
  row: number;
  seat: number;
}

interface Props {
  eventoId: number;
  onZonaClick?: (zona: Zona) => void;
  variant?: Variant;
}

const AuditorioSelectorVerin: React.FC<Props> = ({ eventoId, onZonaClick, variant = "rosa" }) => {
  const [areaActiva, setAreaActiva] = useState(true);
  const [zonaSeleccionada, setZonaSeleccionada] = useState<Zona | null>(null);
  const [entradasSeleccionadas, setEntradasSeleccionadas] = useState<SelectedSeat[]>([]);
  const [entradasReservadas, setEntradasReservadas] = useState<SelectedSeat[]>([]);
  const [misReservas, setMisReservas] = useState<SelectedSeat[]>([]);
  const [entradasDisponibles, setEntradasDisponibles] = useState<number>(0);

  const { token } = useAuth();
  const authToken = token ?? localStorage.getItem("access_token");

  useEffect(() => {
    if (eventoId == null) return;
    const fetchEntradas = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/crear-eventos/${eventoId}/`, {
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
        });
        const data = await response.json();
        setEntradasDisponibles(data.entradas_venta - data.entradas_reservadas);
      } catch (err) {
        console.error("Erro ao obter entradas dispoñibles:", err);
      }
    };
    fetchEntradas();
  }, [eventoId, token]);

  useEffect(() => {
    if (eventoId == null || !zonaSeleccionada) return;
    const fetchReservas = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/crear-eventos/${eventoId}/reservas/?zona=${zonaSeleccionada}`
        );
        const data = await response.json();
        setEntradasReservadas(data.reservas || []);
      } catch (err) {
        console.error("Erro ao obter reservas:", err);
      }
    };
    const fetchMisReservas = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/crear-eventos/${eventoId}/mis-reservas/?zona=${zonaSeleccionada}`,
          {
            headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
          }
        );
        const data = await response.json();
        setMisReservas(data.mis_reservas || []);
      } catch (err) {
        console.error("Erro ao obter miñas reservas:", err);
      }
    };
    fetchReservas();
    fetchMisReservas();
  }, [eventoId, zonaSeleccionada, authToken]);

  const handleClick = (zona: Zona) => {
    setZonaSeleccionada(zona);
    setEntradasSeleccionadas([]);
    setEntradasReservadas([]);
    setMisReservas([]);
    onZonaClick?.(zona);
  };

  const cerrarModal = () => {
    setZonaSeleccionada(null);
    setEntradasSeleccionadas([]);
  };

  const eliminarMiReserva = async (seat: SelectedSeat) => {
    if (eventoId == null || !zonaSeleccionada) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/crear-eventos/${eventoId}/eliminar-reserva/${zonaSeleccionada}/${seat.row}/${seat.seat}/`,
        {
          method: "DELETE",
          headers: {
            "Authorization": authToken ? `Bearer ${authToken}` : "",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMisReservas((prev) =>
          prev.filter(s => !(s.row === seat.row && s.seat === seat.seat))
        );
        setEntradasReservadas((prev) =>
          prev.filter(s => !(s.row === seat.row && s.seat === seat.seat))
        );
        setEntradasDisponibles(data.entradas_dispoñibles);
      } else {
        alert("Erro ao eliminar a reserva");
      }
    } catch (err) {
      console.error("Erro ao eliminar reserva:", err);
      alert("Erro de conexión");
    }
  };

  const renderEsquema = () => {
    const props = {
      selectedSeats: entradasSeleccionadas,
      reservedSeats: entradasReservadas,
      myReservedSeats: misReservas,
      onSelectionChange: setEntradasSeleccionadas,
      onMyReservedSeatClick: eliminarMiReserva,
    };
    switch (zonaSeleccionada) {
      //case "anfiteatro": return <AuditorioVerinAnfiteatro {...props} />;
      case "central": return <AuditorioVerinZonaCentral {...props} />;
      //case "esquerda": return <AuditorioVerinLateralEsquerda {...props} />;
      //case "dereita": return <AuditorioVerinLateralDereita {...props} />;
      default: return null;
    }
  };

  const eliminarEntrada = (seat: SelectedSeat) => {
    setEntradasSeleccionadas(prev =>
      prev.filter(s => !(s.row === seat.row && s.seat === seat.seat))
    );
  };

  const reservarEntradas = async () => {
    if (eventoId == null || !zonaSeleccionada) return;
    if (entradasSeleccionadas.length === 0) return;

    try {
      const response = await fetch(`${API_BASE_URL}/crear-eventos/${eventoId}/reservar/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authToken ? `Bearer ${authToken}` : "",
        },
        body: JSON.stringify({
          zona: zonaSeleccionada,
          entradas: entradasSeleccionadas,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Reservadas ${entradasSeleccionadas.length} entradas!`);
        setEntradasSeleccionadas([]);
        setEntradasDisponibles(data.entradas_dispoñibles);
        setEntradasReservadas((prev) => [...prev, ...(data.reservas || [])]);
        cerrarModal();
      } else {
        alert(data.error || "Erro ao reservar entradas");
      }
    } catch (err) {
      console.error("Erro ao reservar entradas:", err);
      alert("Erro de conexión");
    }
  };

  return (
    <div className={`auditorio-container ${variant}`}>
      {/* BOTONES DE ZONA */}
      <button className="zona anfiteatro" onClick={() => handleClick("anfiteatro")}>ANFITEATRO</button>
      <div className="platea">
        <button className="zona esquerda" onClick={() => handleClick("esquerda")}>ESQUERDA</button>
        <div className="zona-central-wrapper">
          <button className="zona central" onClick={() => handleClick("central")}>CENTRAL</button>
          <div className="indicador-escenario">ESCENARIO</div>
        </div>
        <button className="zona dereita" onClick={() => handleClick("dereita")}>DEREITA</button>
      </div>

      {/* MODAL */}
      {zonaSeleccionada && (
        <div className="modal-backdrop" onClick={cerrarModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {/* SWITCH AREA */}
            <div className="toggle-area-wrapper">
              <label className="toggle-area-label">
                <input type="checkbox" checked={areaActiva} onChange={e => setAreaActiva(e.target.checked)} />
                <span className="toggle-slider"></span>
                <span className="toggle-text">Área {areaActiva ? "Activa" : "Desactivada"}</span>
              </label>
            </div>

            {/* HEADER */}
            <div className="modal-header-custom">
              <div className="modal-title-group">
                <h4 className="modal-title">{zonaSeleccionada.toUpperCase()}</h4>
                <p className="modal-subtitle">*As entradas que reserves, non se porán a venda</p>
                <p>Entradas dispoñibles: {entradasDisponibles}</p>
              </div>
              <button className="close-x" onClick={cerrarModal}>✕</button>
            </div>

            {/* BODY */}
            <div className="modal-body-custom">
              {renderEsquema()}

              {/* LISTADO DE ENTRADAS (SELECCIONADAS + MIÑAS RESERVAS) */}
              {(entradasSeleccionadas.length > 0 || misReservas.length > 0) && (
                <div style={{ marginTop: 20 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
                    <thead style={{ backgroundColor: "#f0f0f0" }}>
                      <tr>
                        <th style={{ padding: "8px", fontWeight: 700 }}>Fila</th>
                        <th style={{ padding: "8px", fontWeight: 700 }}>Butaca</th>
                        <th style={{ padding: "8px", fontWeight: 700 }}>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {misReservas.map(s => (
                        <tr key={`${s.row}-${s.seat}-reservada`} style={{ backgroundColor: "#fff" }}>
                          <td style={{ padding: "8px", fontWeight: 700, color: "#444" }}>{s.row}</td>
                          <td style={{ padding: "8px", fontWeight: 700, color: "#444" }}>{s.seat}</td>
                          <td style={{ padding: "8px" }}>
                            <button className="eliminar-btn" onClick={e => { e.stopPropagation(); eliminarMiReserva(s); }} style={{ background: "transparent", border: "none", cursor: "pointer", color: "black", fontSize: "16px" }}>
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {entradasSeleccionadas.map(s => (
                        <tr key={`${s.row}-${s.seat}`} style={{ backgroundColor: "#fff" }}>
                          <td style={{ padding: "8px", fontWeight: 700, color: "#444" }}>{s.row}</td>
                          <td style={{ padding: "8px", fontWeight: 700, color: "#444" }}>{s.seat}</td>
                          <td style={{ padding: "8px" }}>
                            <button className="eliminar-btn" onClick={e => { e.stopPropagation(); eliminarEntrada(s); }} style={{ background: "transparent", border: "none", cursor: "pointer", color: "black", fontSize: "16px" }}>
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="modal-footer-custom">
              <button className="volver-btn" onClick={cerrarModal}>Cerrar</button>
              <button className="reserva-entrada-btn" disabled={entradasSeleccionadas.length === 0} onClick={reservarEntradas}>
                Reservar {entradasSeleccionadas.length} Entradas
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AuditorioSelectorVerin;