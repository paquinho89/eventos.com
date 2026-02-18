import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";
import RecuperacionEntradasEmail from "./EnvioRecuperacionEntradas";
import { FaEnvelope } from "react-icons/fa";


function RecuperarEntradaModal({ show, onClose }: {show: boolean; onClose: () => void;}) {
  const [showRecuperarEntrada, setShowRecuperarEntrada] = useState(false);
  const handleOpenRecuperarEntrada = () => setShowRecuperarEntrada(true);
  const handleCloseRecuperarEntrada = () => setShowRecuperarEntrada(false);

  return (
    <>
        <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton>
            <Modal.Title>Recuperar Entrada</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group className="mb-3">
            <FaEnvelope style={{ marginRight: "6px" }} />
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control type="text" placeholder="Introduce tu email" />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>Número de Teléfono</Form.Label>
            <Form.Control type="text" placeholder="Introduce tu número de teléfono" />
            </Form.Group>

        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onClose} className="boton-avance">
            Cerrar
            </Button>
            <Button variant="primary" onClick={()=>{handleOpenRecuperarEntrada(); onClose() }} className="reserva-entrada-btn">
            Enviar Entradas
            </Button>
        </Modal.Footer>
        </Modal>
        <RecuperacionEntradasEmail
            show={showRecuperarEntrada}
            onClose={handleCloseRecuperarEntrada}
        />
      </>
  );
}

export default RecuperarEntradaModal;
