import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";
import RecuperacionEntradasEmail from "./EnvioRecuperacionEntradas";


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
            Para recupera tu entrada necesitamos tu email o número de teléfono

            <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="text" placeholder="email" />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>Número de Teléfono</Form.Label>
            <Form.Control type="text" placeholder="email" />
            </Form.Group>

        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>
            Cerrar
            </Button>
            <Button variant="primary" onClick={()=>{handleOpenRecuperarEntrada(); onClose() }}>
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
