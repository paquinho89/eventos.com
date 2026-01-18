import { Modal, Button } from "react-bootstrap";

function RecuperacionEntradasEmail({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Verifica tu email</Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center">
        <p>
          Hemos enviado un correo y WhatsApp con tus entradas. En caso de no recibirlo, mire en la bandeja de entrada o contacto con nosotros a través de info@eventos.com
          <br />
          Por favor, revisa tu bandeja de entrada y tu correo de Spam.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginTop: "15px",
          }}
        >
          {/* Gmail */}
          <a
            href="https://mail.google.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png"
              alt="Gmail"
              width={40}
            />
          </a>

          {/* Yahoo */}
          <a
            href="https://mail.yahoo.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/24/Yahoo_Mail_icon_2021.svg"
              alt="Yahoo"
              width={40}
            />
          </a>

          {/* Outlook */}
          <a
            href="https://outlook.live.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Microsoft_Outlook_2013-2019_logo.svg"
              alt="Outlook"
              width={40}
            />
          </a>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={onClose}>
          Entendido
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RecuperacionEntradasEmail;
