import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function VerificacionEmailPage() {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const [status, setStatus] = useState<"verificando" | "exito" | "error">("verificando");

  useEffect(() => {
    if (uid && token) {
      axios
        .get(`http://localhost:8000/organizador/verificar/${uid}/${token}/`)
        .then(() => setStatus("exito"))
        .catch(() => setStatus("error"));
    } else {
      setStatus("error");
    }
  }, [uid, token]);

  const renderMessage = () => {
    switch (status) {
      case "verificando":
        return <p>Verificando tu cuenta...</p>;
      case "exito":
        return <p style={{ color: "green" }}>¡Cuenta verificada correctamente! Ya puedes iniciar sesión.</p>;
      case "error":
        return <p style={{ color: "red" }}>El link es inválido o ha caducado.</p>;
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", textAlign: "center", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h2>Verificación de Email</h2>
      {renderMessage()}
    </div>
  );
}

export default VerificacionEmailPage;
