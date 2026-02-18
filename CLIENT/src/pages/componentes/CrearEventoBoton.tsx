import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginModalCrearEvento from "./InicioSesionCrearEventoCuadro";
import "../../estilos/Botones.css";

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
        className="boton-avance"
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
