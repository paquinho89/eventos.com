import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import MainNavbar from "../componentes/NavBar";
import { ProgressBar } from "react-bootstrap";

export function CreateEventLayout() {
  const [evento, setEvento] = useState({
    tipo: "",
    titulo_descripcion: "",
    imagen: null as File | null,
    fecha: "",
    lugar: "",
    entradas_precio_cuenta: "",
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
