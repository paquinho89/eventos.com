import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";
import EmailVerificationModal from "./VerificacionEmailCreacionCuenta"


function CreateAccountModal({ show, onClose }: {show: boolean; onClose: () => void;}) {

  const [showVerificacionEmail, setShowVerificacionEmail] = useState(false);
  const handleOpenVerificacionEmail = () => setShowVerificacionEmail(true);
  const handleCloseVerificacionEmail = () => setShowVerificacionEmail(false);

  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState("") //Pode tomar valores de "repetido ou inválido"
  const validarEmail = (email:string) => {
    const expresionRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return expresionRegular.test(email)
  }
  const [nombreOrganizador, setNombreOrganizador] = useState("");
  const [erroNomeOrganizador, setErroNomeOrganizador] = useState("");
  const [contraseña, setContraseña] = useState(""); 
  const [fotoOrganizador, setFotoOrganizador] = useState<File | null>(null);
  const [telefono, setTelefono] = useState("");
  const [errorTelefono, setErrorTelefono] = useState("");
  const validarTelefono = (telefono:string) => {
    const expresionRegpular = /^[6789]\d{8}$/;
    return expresionRegpular.test(telefono);
  }
  const [mayorEdad, setMayorEdad] = useState(false);
  const [errorMayorEdad, setErrorMayorEdad] = useState(false);
  const [loading, setLoading] = useState(false);

  
  const enviarDatosBackend = async (): Promise<boolean> => {
  if (email==""){
    setErrorEmail ("invalido");
    return false;
  }
  if (validarEmail(email)==false) {
    setErrorEmail("invalido");
    return false;
  }
  if (!validarTelefono(telefono)){
    setErrorTelefono("invalido");
    return false;
  }
  if (nombreOrganizador.trim()===""){
    setErroNomeOrganizador("invalidoNomeOrganizador");
    return false;
  }
  if (mayorEdad==false){
    setErrorMayorEdad(true); 
    return false; // ⛔ aquí a función para, NON se executa nada máis
  }
  const formData = new FormData();
  formData.append("email", email);
  formData.append("username", email.split("@")[0]);
  formData.append("nome_organizador", nombreOrganizador);
  formData.append("password", contraseña);
  formData.append("telefono", telefono);
  formData.append("mayor_edad", mayorEdad.toString());
  if (fotoOrganizador) {
    formData.append("foto_organizador", fotoOrganizador);
  }

  const response = await fetch("http://localhost:8000/organizador/crear-organizador/", {
    method: "POST",
    body: formData, // 📌 FormData no JSON
  });
  if (!response.ok){
    return false;
  }
  return true
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
            <Form.Label>Email</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="email" 
              value={email}
              onChange={(e) => {
                const value = e.target.value;
                setEmail(value);
                if (value && validarEmail(value)==false) {
                  setErrorEmail("invalido");}
                else {
                  setErrorEmail("");
                }
              }}
            />
          </Form.Group>
          {errorEmail === "invalido" && (
            <div className="alert alert-danger">
              Por favor, introduce un email válido
            </div>
          )}
          {errorEmail === "repetido" && (
            <div className="alert alert-danger">
              Este email xa está rexistrado
            </div>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Nome do Organizador</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Organizor ou Empresa" 
              value={nombreOrganizador}
              onChange={(e) => {
                const value = e.target.value;
                setNombreOrganizador(value);
                if (value==="") {
                  setErroNomeOrganizador("invalidoNomeOrganizador");}
                else {
                  setErroNomeOrganizador("");
                }
                }} />
          </Form.Group>

          {erroNomeOrganizador === "invalidoNomeOrganizador" && (
            <div className="alert alert-danger">
              Por favor, introduce tú nombre de organizador
            </div>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"   //aquí enmascara o texto
              placeholder="Introduce tu contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)} 
            />
          </Form.Group>


          <Form.Group className="mb-3">
            <Form.Label>Sube tu logo/foto</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"        
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files.length > 0) {setFotoOrganizador(e.target.files[0]);}
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Número de teléfono</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="WhatsApp e Bizum"
              value={telefono}
              onChange={(e)=> {
                const value = e.target.value.replace(/\D/g, ""); // solo números
                setTelefono(value);

                if (value && !validarTelefono(value)){
                  setErrorTelefono("invalido");
                } else {
                  setErrorTelefono("");
                }
              }}
           />
          </Form.Group>

          {errorTelefono === "invalido" && (
            <div className = "alert alert-danger">
              Introduce un número de teléfono válido
            </div>
          )}
          
          <Form.Group className="mb-3">
            <Form.Check 
              type="checkbox"
              label="¿Eres mayor de edad?"
              checked={mayorEdad}
              onChange={(e) => {setMayorEdad(e.target.checked);
                if (e.target.checked) {
                  setErrorMayorEdad(false);
                }
              }}
            />
          </Form.Group>
          {errorMayorEdad ? (
            <div className="alert alert-danger">
              Para crear una cuenta como organizador debes de ser mayor de edad
            </div>
          ) : null}

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
          <Button 
            variant="primary" 
            disabled={loading}
            onClick={async()=>{
            setLoading(true);
            const ok = await enviarDatosBackend(); 
            setLoading(false);

            if (!ok) return;
            onClose();
            handleOpenVerificacionEmail();}}>
            {loading ? "Creando..." : "Crear Cuenta"}
          </Button>
        </Modal.Footer>
      </Modal>
      <EmailVerificationModal show= {showVerificacionEmail} onClose={handleCloseVerificacionEmail}/>
      
    </>
  );
}

export default CreateAccountModal;
