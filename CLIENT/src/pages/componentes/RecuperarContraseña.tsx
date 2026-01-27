import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import EnvioEmailRecuperacionContraseña from "./EnvioEmailRecuperacionContraseña"

function RecuperarContraseñaModal({ show, onClose }: {show: boolean; onClose: () => void;}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [showEnvioEmailRecuperacionContraseña, setEnvioEmailRecuperacionContraseña] = useState(false);

  const handleRecuperarContraseña = async () => {
    setError("");
    setSuccess("");
    if (!email) {
      setError("Por favor, introduce un email.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:8000/organizador/recuperar-contrasena/", {
        email: email.toLowerCase(),
      });
      onClose();
      setEnvioEmailRecuperacionContraseña(true);

      setSuccess("Revisa o teu email, enviámosche un link para recuperar a túa contraseña.");
      setEmail("");
    } catch (err: any) {
      const msg = err.response?.data?.error || "Ocorreu un erro. Intenta novamente.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton>
            <Modal.Title>Recuperar tu contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control 
                type="text" 
                placeholder="Introduce tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            </Form.Group>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>
            Cerrar
            </Button>
            <Button 
                variant="primary" 
                onClick={handleRecuperarContraseña}
                disabled={loading}
            >
            {loading ? "Enviando..." : "Recuperar Contraseña"}
            </Button>
        </Modal.Footer>
        </Modal>
        <EnvioEmailRecuperacionContraseña
            show={showEnvioEmailRecuperacionContraseña}
            onClose={()=> setEnvioEmailRecuperacionContraseña(false)}
        />
    </>
  );
}

export default RecuperarContraseñaModal;
