import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import MainNavbar from "../componentes/NavBar";
import Anfiteatro from "../planoAuditorios/Planos/auditorioVerin/anfiteatro";
import ZonaCentral from "../planoAuditorios/Planos/auditorioVerin/zonaCentral";
import ZonaLateralDereita from "../planoAuditorios/Planos/auditorioVerin/zonaLateralDereita";
import ZonaLateralEsquerda from "../planoAuditorios/Planos/auditorioVerin/zonaLateralEsquerda";

import API_BASE_URL from "../../utils/api";



const SeleccionButacaAuditorio: React.FC = () => {
  const navigate = useNavigate();
  const { zona, id } = useParams<{ zona: string; id: string }>();
  const [reservedSeats, setReservedSeats] = useState<{ row: number; seat: number }[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<{ row: number; seat: number }[]>([]);
  // Eliminado o flag localStorageRestaurado para evitar condicións de carreira

  // Limpar seleccións só se se entra dende SeleccionZonaAuditorio (non ao cambiar de área)
  useEffect(() => {
    if (!id || !zona) return;
    // Detectar se a navegación vén dende SeleccionZonaAuditorio
    const fromZona = window.history.state && window.history.state.usr && window.history.state.usr.fromSeleccionZonaAuditorio;
    if (fromZona) {
      const zonas = ["central", "dereita", "anfiteatro", "esquerda"];
      zonas.forEach(z => {
        const key = `auditorio_verin_selected_${z}_${id}`;
        localStorage.removeItem(key);
      });
      setSelectedSeats([]);
    }
  }, [id, zona]);


  // Recuperar todas as seleccións de todas as zonas ao montar, priorizando navigation state se existe
  useEffect(() => {
    if (!id) return;
    const zonas = ["central", "dereita", "anfiteatro", "esquerda"];
    const state = window.history.state && window.history.state.usr && window.history.state.usr.butacasSeleccionadas;
    if (state && Array.isArray(state)) {
      // Restaurar localStorage para todas as zonas
      zonas.forEach(z => {
        const key = `auditorio_verin_selected_${z}_${id}`;
        const lista = state.filter((b: any) => b.zona === z);
        localStorage.setItem(key, JSON.stringify(lista));
      });
      setSelectedSeats(state.filter((b: any) => b.zona === zona));
    } else {
      // Se non hai navigation state, cargar de localStorage
      const key = `auditorio_verin_selected_${zona}_${id}`;
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          const lista = JSON.parse(raw);
          if (Array.isArray(lista)) {
            setSelectedSeats(lista);
            return;
          }
        } catch {}
      }
      setSelectedSeats([]);
    }
  }, [id, zona]);

  // Eliminado o useEffect extra, xa non é necesario

  // Gardar seleccións no localStorage cando cambian, mantendo as doutras zonas
  useEffect(() => {
    if (!id || !zona) return;
    const zonas = ["central", "dereita", "anfiteatro", "esquerda"];
    // Recuperar todas as seleccións actuais
    let todas: { [zona: string]: any[] } = {};
    zonas.forEach(z => {
      const key = `auditorio_verin_selected_${z}_${id}`;
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          const lista = JSON.parse(raw);
          if (Array.isArray(lista)) todas[z] = lista;
        } catch {}
      }
    });
    // Actualizar só a zona actual
    todas[zona] = selectedSeats;
    // Gardar todas as zonas
    zonas.forEach(z => {
      const key = `auditorio_verin_selected_${z}_${id}`;
      localStorage.setItem(key, JSON.stringify(todas[z] || []));
    });
  }, [selectedSeats, id, zona]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id || !zona) return;
    setLoading(true);
    fetch(`${API_BASE_URL}/crear-eventos/${id}/reservas/?zona=${zona}`)
      .then((res) => res.json())
      .then((data) => {
        setReservedSeats(data.reservas || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, zona]);

  let ZonaComponent = null;
  let zonaTitulo = "";
  const zonas = ["central", "dereita", "anfiteatro", "esquerda"];
  const zonasTitulos: Record<string, string> = {
    central: "Central",
    dereita: "Dereita",
    anfiteatro: "Anfiteatro",
    esquerda: "Esquerda",
  };
  const commonProps = {
    reservedSeats,
    blockReservedSeats: true,
    selectedSeats,
    onSelectionChange: setSelectedSeats,
  };
  switch (zona) {
    case "anfiteatro":
      ZonaComponent = <Anfiteatro {...commonProps} />;
      zonaTitulo = zonasTitulos["anfiteatro"];
      break;
    case "central":
      ZonaComponent = <ZonaCentral {...commonProps} />;
      zonaTitulo = zonasTitulos["central"];
      break;
    case "esquerda":
      ZonaComponent = <ZonaLateralEsquerda {...commonProps} />;
      zonaTitulo = zonasTitulos["esquerda"];
      break;
    case "dereita":
      ZonaComponent = <ZonaLateralDereita {...commonProps} />;
      zonaTitulo = zonasTitulos["dereita"];
      break;
    default:
      ZonaComponent = <div>Zona non válida</div>;
      zonaTitulo = "";
  }

  // Navegación circular segura
  const zonaActualIndex = zonas.indexOf(zona || "");
  const zonaEsquerda = zonaActualIndex === -1 ? null : zonas[(zonaActualIndex - 1 + zonas.length) % zonas.length];
  const zonaDereita = zonaActualIndex === -1 ? null : zonas[(zonaActualIndex + 1) % zonas.length];

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      <MainNavbar />
      <div style={{ maxWidth: 700, margin: "0 auto", padding: 32 }}>
        {loading ? (
          <div style={{ textAlign: "center", margin: 40 }}>Cargando butacas reservadas...</div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, gap: 16 }}>
              {zonaActualIndex !== -1 && zonaEsquerda && (
                <button
                  aria-label="Ir á área anterior"
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, padding: 4 }}
                  onClick={() => {
                    if (id && zona && zonaEsquerda) {
                      // Gardar seleccións da zona actual antes de cambiar
                      const key = `auditorio_verin_selected_${zona}_${id}`;
                      localStorage.setItem(key, JSON.stringify(selectedSeats));
                      navigate(`/reservar-entrada-auditorio/${id}/${zonaEsquerda}`);
                    }
                  }}
                >
                  <FaChevronLeft />
                </button>
              )}
              <h2 style={{ margin: 0, minWidth: 100, textAlign: "center" }}>{zonaTitulo}</h2>
              {zonaActualIndex !== -1 && zonaDereita && (
                <button
                  aria-label="Ir á área seguinte"
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, padding: 4 }}
                  onClick={() => {
                    if (id && zona && zonaDereita) {
                      // Gardar seleccións da zona actual antes de cambiar
                      const key = `auditorio_verin_selected_${zona}_${id}`;
                      localStorage.setItem(key, JSON.stringify(selectedSeats));
                      navigate(`/reservar-entrada-auditorio/${id}/${zonaDereita}`);
                    }
                  }}
                >
                  <FaChevronRight />
                </button>
              )}
            </div>
            <div style={{ marginBottom: 24 }}>{ZonaComponent}</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
              <button className="boton-avance" onClick={() => {
                if (id) {
                  const zonas = ["central", "dereita", "anfiteatro", "esquerda"];
                  zonas.forEach(z => {
                    const key = `auditorio_verin_selected_${z}_${id}`;
                    localStorage.removeItem(key);
                  });
                  setSelectedSeats([]);
                  navigate(`/reservar-entrada-auditorio/${id}`);
                }
              }}>
                <FaArrowLeft style={{ marginRight: 8 }} /> Volver
              </button>
              <button
                className="reserva-entrada-btn"
                onClick={() => {
                  if (id) {
                    // Gardar as seleccións actuais da zona no localStorage
                    const key = `auditorio_verin_selected_${zona}_${id}`;
                    localStorage.setItem(key, JSON.stringify(selectedSeats));
                    // Recuperar todas as seleccións de todas as zonas
                    const zonas = ["central", "dereita", "anfiteatro", "esquerda"];
                    let todas: any[] = [];
                    zonas.forEach(z => {
                      const key = `auditorio_verin_selected_${z}_${id}`;
                      const raw = localStorage.getItem(key);
                      if (raw) {
                        try {
                          const lista = JSON.parse(raw);
                          if (Array.isArray(lista)) {
                            lista.forEach((b: any) => {
                              if (b && typeof b.row === "number" && typeof b.seat === "number") {
                                todas.push({ ...b, zona: z });
                              }
                            });
                          }
                        } catch {}
                      }
                    });
                    // Pasar tamén a última zona visitada
                    navigate(`/reservar-entrada-con-plano/${id}/${zona || "central"}`,
                      { state: { butacasSeleccionadas: todas, ultimaZonaVisitada: zona } }
                    );
                  }
                }}
              >
                Continuar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SeleccionButacaAuditorio;
