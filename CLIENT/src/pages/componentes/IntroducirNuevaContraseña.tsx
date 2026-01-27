import { Button, Form, InputGroup } from "react-bootstrap";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function IntroducirNuevaContraseña() {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const navigate = useNavigate();

  const [contraseña, setContraseña] = useState("");
  const [showContraseña, setShowContraseña] = useState(false);
  const validarContraseña = (pass: string) => {
    if (!pass) return "La contraseña es obligatoria";
    if (pass.length < 8) return "La contraseña debe tener al menos 8 caracteres";
    if (!/[A-Z]/.test(pass)) return "Debe incluir al menos una letra mayúscula";
    if (!/[a-z]/.test(pass)) return "Debe incluir al menos una letra minúscula";
    if (!/[0-9]/.test(pass)) return "Debe incluir al menos un número";
    return ""; // ✅ si todo está bien
    };
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const errorValidacion = validarContraseña(contraseña);

    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:8000/organizador/reset-password/${uid}/${token}/`,
        { password : contraseña }
      );
      localStorage.setItem(
        "organizador",
        JSON.stringify(response.data.organizador)
        );
      setSuccess("Contraseña cambiada correctamente. Ya puedes iniciar sesión.");
      setContraseña("");

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate("/crear-evento");
      }, 2000);
    } catch (err: any) {
      const msg = err.response?.data?.error || "Ocurrió un error. Intenta nuevamente.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2 className="mb-4 text-center">Nueva contraseña</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <Form.Group className="mb-3">
        <Form.Label>Contraseña</Form.Label>
        <InputGroup>
        <Form.Control
            type={showContraseña ? "text" : "password"}   //aquí enmascara o texto
            placeholder="Introduce tu contraseña"
            value={contraseña}
            onChange={(e) => {
            const value = e.target.value;
            setContraseña(value);
            // Validación en tempo real
            if (value) {
                const error = validarContraseña(value);
                setError(error);
            } else {
                setError("La contraseña es obligatoria");
            }
            }}
        />
        <Button
            variant="outline-secondary"
            onClick={() => setShowContraseña(!showContraseña)}
        >
            {showContraseña ? "🙈" : "👁️"}
        </Button>
        </InputGroup>
        {error && <div className = "alert alert-danger">{error}</div>}
        <Button 
            className="btn btn-primary w-100" 
            onClick={handleSubmit}
            disabled={loading}
        >
            {loading ? "Enviando..." : "Cambiar contraseña"}
        </Button>
    </Form.Group>
    </div>
  );
}

export default IntroducirNuevaContraseña;
