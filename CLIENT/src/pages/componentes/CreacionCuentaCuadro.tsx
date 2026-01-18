import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";
import EmailVerificationModal from "./VerificacionEmailCreacionCuenta"


function CreateAccountModal({ show, onClose }: {show: boolean; onClose: () => void;}) {

  const [showVerificacionEmail, setShowVerificacionEmail] = useState(false);
  const handleOpenVerificacionEmail = () => setShowVerificacionEmail(true);
  const handleCloseVerificacionEmail = () => setShowVerificacionEmail(false);

  const [nombreOrganizador, setNombreOrganizador] = useState("");
  const enviarNombreOrganizador = async () => {
    await fetch ("http://localhost:8000/organizador/crear-organizador/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre_organizador: nombreOrganizador,
    }),
  });

  handleOpenVerificacionEmail();
  onClose();
};

  return (
    <>
      <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Crear tu cuenta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Para realizar cualquier fución en la plataforma debes de crear una cuenta

          <Form.Group className="mb-3">
            <Form.Label>Nome do Organizador</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Organizor ou Empresa" 
              value={nombreOrganizador}
              onChange={(e) => setNombreOrganizador(e.target.value)} />
          </Form.Group>
          {/*
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="text" placeholder="email" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Número de teléfono (Importante para facilitar trasacciones a través da platoforma)</Form.Label>
            <Form.Control type="text" placeholder="WhatsApp e Bizum" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control type="password" placeholder="contraseña" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Repita a contraseña</Form.Label>
            <Form.Control type="password" placeholder="contraseña" />
          </Form.Group>

          <Form.Group className="mb-3">
              <Form.Label>Logo ou Imaxe</Form.Label>
              <Form.Control type="file" accept="image/*" />
          </Form.Group>
*/}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={()=>{handleOpenVerificacionEmail(); onClose(); enviarNombreOrganizador()}}>
            Crear Cuenta
          </Button>
        </Modal.Footer>
      </Modal>
      <EmailVerificationModal show= {showVerificacionEmail} onClose={handleCloseVerificacionEmail}/>
      
    </>
  );
}

export default CreateAccountModal;
