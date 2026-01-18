import { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import LoginModalCrearEvento from "./InicioSesionCrearEventoCuadro";

function CrearEventoBoton({ isLoggedIn }: { isLoggedIn?: boolean }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    isLoggedIn ? navigate("/crear-evento") : setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  return (
    <>
      <Button variant="primary" onClick={handleClick}>
        Crear evento
      </Button>

      {/* Componente modal */}
      <LoginModalCrearEvento show={showModal} onClose={handleClose} />
    </>
    
  );
}

export default CrearEventoBoton;
