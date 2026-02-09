import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginModalCrearEvento from "./InicioSesionCrearEventoCuadro";
import "../../estilos/crearEventoBoton.css";

function CrearEventoBoton() {
  const loggedIn = localStorage.getItem("organizador")
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    loggedIn ? navigate("/crear-evento/tipo") : setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  return (
    <>
      <button
        className="airbnb-host-btn"
        onClick={handleClick}
      >
        Publicar evento
      </button>

      {/* Componente modal */}
      <LoginModalCrearEvento show={showModal} onClose={handleClose} />
    </>
    
  );
}

export default CrearEventoBoton;
