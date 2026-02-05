import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import MainNavbar from "../componentes/NavBar";
import { ProgressBar } from "react-bootstrap";

export interface Evento {
  tipo: string;
  titulo_descripcion: string;
  imagen: File | null;
  fecha: string;
  lugar: string;
  ubicacion: string;
  entradas: number;
  precio: number;
  iban: string;
  esAuditorio?: boolean;
  condiciones_confirmacion: boolean;
}

export interface OutletContext {
  evento: Evento;
  setEvento: React.Dispatch<React.SetStateAction<Evento>>;
}

export function CreateEventLayout() {
  const [evento, setEvento] = useState<Evento>({
    tipo: "",
    titulo_descripcion: "",
    imagen: null as File | null,
    fecha: "",
    lugar: "",
    ubicacion: "",
    entradas:0,
    precio: 0,
    iban: "",
    esAuditorio: false,
    condiciones_confirmacion: false,
  });

  const location = useLocation();

  const pasos = [
    "/crear-evento/tipo",
    "/crear-evento/titulo",
    "/crear-evento/descripcion",
    "/crear-evento/cartel",
    "/crear-evento/precio",
    "/crear-evento/lugar",
    "/crear-evento/fecha",
    "/crear-evento/cuenta_bancaria",
  ];

  const currentStep = pasos.findIndex((p) => location.pathname.startsWith(p)) + 1;
  const totalSteps = pasos.length;

  const progress = (currentStep / totalSteps) * 100;

  return (
    <>
      <MainNavbar />
      <div className="container py-3">
        <ProgressBar now={progress} label={`Paso ${currentStep} de ${totalSteps}`} />
      </div>
      <Outlet context={{ evento, setEvento }} />
    </>
  );
}
