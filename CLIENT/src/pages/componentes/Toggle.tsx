import { useState } from "react";
import { Button, Card, ListGroup } from "react-bootstrap";
import CreateAccountModal from "./CreacionCuentaCuadro";
import LoginModal from "./InicioSesionCuadro";
import RecuperarEntradaModal from "./RecuperarEntradaCuadro"

function ToggleHamburguer() {
  const [open, setOpen] = useState(false);

  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [showLogIn, setShowLogIn] = useState(false);
  const [showRecuperacionEntradas, setShowRecuperacionEntradas] = useState(false);
  const handleOpenCreateAccount = () => setShowCreateAccount(true);
  const handleCloseCreateAccount = () => setShowCreateAccount(false);
  const handleOpenLogIn = () => setShowLogIn(true);
  const handleCloseLogIn = () => setShowLogIn(false);
  const handleOpenRecuperacionEntradas = () => setShowRecuperacionEntradas(true);
  const handleCloseRecuperacionEntradas = () => setShowRecuperacionEntradas(false);

  return (
    <div style={{ position: "relative" }}>
      <Button onClick={() => setOpen(!open)} className= "toggle-hamburguer">
        {/* 3 rayitas */}
        <span style={{ width: "20px", height: "2px", backgroundColor: "white", margin: "3px 0" }} />
        <span style={{ width: "20px", height: "2px", backgroundColor: "white", margin: "3px 0" }} />
        <span style={{ width: "20px", height: "2px", backgroundColor: "white", margin: "3px 0" }} />
      </Button>

      {/* Menú desplegable circular */}
      {open && (
        <>
            <Card className="toggle-card">
            <ListGroup variant="flush">
                <ListGroup.Item action onClick={handleOpenLogIn}>
                Inicio Sesión Organizador
                </ListGroup.Item>
                <ListGroup.Item action onClick={handleOpenCreateAccount}>
                Crear Cuenta Organizador
                </ListGroup.Item>
                <ListGroup.Item action onClick={handleOpenRecuperacionEntradas}>
                Volver imprimir tu entrada
                </ListGroup.Item>
            </ListGroup>
            </Card>
            <LoginModal show={showLogIn} onClose={handleCloseLogIn}/>
            <CreateAccountModal show={showCreateAccount} onClose={handleCloseCreateAccount}/>
            <RecuperarEntradaModal show={showRecuperacionEntradas} onClose={handleCloseRecuperacionEntradas}/>
        </>
      )}
    </div>
  );
}

export default ToggleHamburguer;
