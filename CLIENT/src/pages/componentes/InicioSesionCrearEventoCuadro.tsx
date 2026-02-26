import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CreateAccountModal from "./CreacionCuentaCuadro";
import axios from "axios";
import RecuperarContraseñaModal from "./RecuperarContraseña";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "../../estilos/TarjetaEventoHome.css";
import "../../estilos/Botones.css";
import { useAuth } from "../AuthContext";


function LoginModalCrearEvento({ show, onClose }: {show: boolean; onClose: () => void;}) {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showCreateAccount, setShowCreateAccount] = useState(false);
    const handleOpenCreateAccount = () => setShowCreateAccount(true);
    const handleCloseCreateAccount = () => setShowCreateAccount(false);

    const [showRecuperarContraseña, setShowRecuperarContraseña] = useState(false);
    const handleOpenRecuperarContraseña = () => setShowRecuperarContraseña(true);
    const handleCloseRecuperarContraseña = () => setShowRecuperarContraseña(false);

    const [email, setEmail] = useState("");
    const [errorEmail, setErrorEmail] = useState("") //Pode tomar valores de "repetido ou inválido"
    const validarEmail = (email:string) => {
        const expresionRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return expresionRegular.test(email)
    }
    const [errorEmailLogin, setErrorEmailLogin] = useState("");


    const [contraseña, setContraseña] = useState("");
    const [showContraseña, setShowContraseña] = useState(false);
    const [errorPasswordLogin, setErrorPasswordLogin] = useState("");

    const [errorLogin, setErrorLogin] = useState("")

    const handleLogin = async () => {
        setErrorEmailLogin("");
        setErrorPasswordLogin("");
        setErrorLogin("");
        try {
            const response = await axios.post("http://localhost:8000/organizador/login/", {
                email: email.toLowerCase(),
                password:contraseña,
            });
            // Guardar el token de acceso
            localStorage.setItem("access_token", response.data.access_token);
            localStorage.setItem("refresh_token", response.data.refresh_token);
            login(response.data.organizador, response.data.access_token); // Actualiza el contexto global con los datos del organizador
            onClose();
            navigate("/crear-evento/tipo");
        } catch (err: any) {
            const msg = err.response?.data?.error || "";
            if (msg.toLowerCase().includes("email")) {
                setErrorEmailLogin(msg);
            } else if (msg.toLowerCase().includes("contraseña")) {
                setErrorPasswordLogin(msg);
            } else {
                setErrorLogin(msg);
            }
            }
};
  
  return (
    <>
        <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton>
            <Modal.Title>Inicio de sesión requerido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group className="mb-3">
            <FaEnvelope style={{ marginRight: "6px" }} />
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control 
                type="text" 
                placeholder="email"
                value = {email}
                onChange={(e) => {
                    const value = e.target.value;
                    setEmail (value);
                    setErrorEmail ("");
                    if (value && !validarEmail(value)){
                        setErrorEmail("invalido");
                    }
                }}
            />
            </Form.Group>
            {errorEmail === "invalido" && (
                <div className="alert alert-danger">
                    Por favor, introduce un email válido
                </div>
            )}

            {errorEmailLogin && (
                <div className="alert alert-danger">
                    {errorEmailLogin}
                </div>
            )}

            <Form.Group>
                <FaLock style={{ marginRight: "6px" }} />
                <Form.Label>Contraseña</Form.Label>
                <InputGroup>
                    <Form.Control
                        type={showContraseña ? "text" : "password"}   //aquí enmascara o texto
                        placeholder="Mín 8 caracteres"
                        value={contraseña}
                        onChange={(e) => {
                        const value = e.target.value;
                        setContraseña(value);
                        }}
                    />
                    <Button
                        variant="outline-secondary"
                        onClick={() => setShowContraseña(!showContraseña)}
                    >
                        {showContraseña ? "🙈" : "👁️"}
                    </Button>
                </InputGroup>
                <div className="d-grid gap-2 mt-2">
                    <Button
                        className="badge-prezo mt-2"
                        onClick={()=>{handleOpenRecuperarContraseña(); onClose();}}
                    >
                        Recuperar contraseña
                    </Button>
                    <Button className="badge-prezo mt-2" onClick={() => {handleOpenCreateAccount(); onClose();}}>
                        Non teño conta
                    </Button>
                </div>
                </Form.Group>
                {errorPasswordLogin && (
                    <div className="alert alert-danger">
                        {errorPasswordLogin}
                    </div>
                )}
                {errorLogin && (
                <div className="alert alert-danger">
                    {errorLogin}
                </div>
                )}
                </Modal.Body>
                <Modal.Footer className=" d-flex justify-content-between">
                    <Button variant="secondary" onClick={onClose} className="boton-avance">
                    Cerrar
                    </Button>
                    <Button variant="primary" onClick={() => {handleLogin()}} className="reserva-entrada-btn">
                    Iniciar sesión
                    </Button>
                </Modal.Footer>
                </Modal>
                <CreateAccountModal
                    show={showCreateAccount}
                    onClose={handleCloseCreateAccount}
                />
                <RecuperarContraseñaModal
                    show={showRecuperarContraseña}
                    onClose={handleCloseRecuperarContraseña}
                />
            </>
  );
}

export default LoginModalCrearEvento;
