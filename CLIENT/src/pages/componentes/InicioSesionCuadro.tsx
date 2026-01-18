import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CreateAccountModal from "./CreacionCuentaCuadro";


function LoginModal({ show, onClose }: {show: boolean; onClose: () => void;}) {
  const navigate = useNavigate();
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const handleOpenCreateAccount = () => setShowCreateAccount(true);
  const handleCloseCreateAccount = () => setShowCreateAccount(false);

  return (
    <>
        <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton>
            <Modal.Title>Iniciar sesión requerida</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Debes iniciar sesión para crear un evento.

            <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="text" placeholder="email" />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control type="password" placeholder="contraseña" />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={()=>{handleOpenCreateAccount(); onClose();}}>
            No tienes cuenta? Crea una nueva
            </Button>
            <Button variant="secondary" onClick={onClose}>
            Cerrar
            </Button>
            <Button variant="primary" onClick={() => navigate("/panel-organizador")}>
            Iniciar sesión
            </Button>
        </Modal.Footer>
        </Modal>
        <CreateAccountModal
            show={showCreateAccount}
            onClose={handleCloseCreateAccount}
        />
      </>
  );
}

export default LoginModal;
