import { Container, Card, Form, Button, ListGroup } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Lugar() {
  const navigate = useNavigate();
  const { evento, setEvento }: any = useOutletContext();

  // Estados
  const [pais, setPais] = useState(evento.pais || "ES");
  const [cidade, setCidade] = useState(evento.cidade || "");
  const [cidadeQuery, setCidadeQuery] = useState(evento.cidade || "");
  const [tipoLugar, setTipoLugar] = useState(evento.tipoLugar || "");
  const [inputLugar, setInputLugar] = useState(evento.lugar || "");
  const [predictions, setPredictions] = useState<any[]>([]);
  const [cidadeSuggestions, setCidadeSuggestions] = useState<string[]>([]);
  const [validSelection, setValidSelection] = useState(false);

  const TIPOS_LUGAR = [
    "Auditorio",
    "Teatro",
    "Pabellón",
    "Bar",
    "Restaurante",
    "Universidade",
    "Instituto",
    "Praza",
    "Centro Cultural",
    "Recinto Privado",
  ];

  // 🔹 Autocomplete cidades
  useEffect(() => {
    if (cidadeQuery.length < 1) {
      setCidadeSuggestions([]);
      return;
    }

    const handler = setTimeout(() => {
      fetch(`/api/cidades?pais=${pais}&q=${encodeURIComponent(cidadeQuery)}`)
        .then((res) => res.json())
        .then((data) => setCidadeSuggestions(data))
        .catch(() => setCidadeSuggestions([]));
    }, 300);

    return () => clearTimeout(handler);
  }, [cidadeQuery, pais]);

  // 🔹 Buscar lugares
  useEffect(() => {
    if (inputLugar.length < 2 || !tipoLugar || !cidade) {
      setPredictions([]);
      return;
    }

    fetch(`/api/lugares?pais=${pais}&cidade=${encodeURIComponent(cidade)}&tipo=${tipoLugar}&q=${encodeURIComponent(inputLugar)}`)
      .then((res) => res.json())
      .then((data) => setPredictions(data))
      .catch(() => setPredictions([]));
  }, [inputLugar, tipoLugar, pais, cidade]);

  const handleSelectLugar = (lugar: any) => {
    setEvento({
      ...evento,
      pais,
      cidade,
      tipoLugar,
      lugar: lugar.nome,
    });
    setInputLugar(lugar.nome);
    setPredictions([]);
    setValidSelection(true);
  };

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card className="shadow-sm" style={{ maxWidth: "600px", width: "100%" }}>
        <Card.Body className="p-4">
          <div className="mb-3">
            <Button variant="link" className="p-0 text-decoration-none" onClick={() => navigate(-1)}>
              ← Volver
            </Button>
          </div>

          <h3 className="text-center mb-2">Lugar do evento</h3>
          <p className="text-muted text-center mb-4">
            Selecciona país, escribe a cidade/vila e selecciona unha suxestión, logo o tipo de lugar e o lugar exacto.
          </p>

          <Form>
            {/* País */}
            <Form.Select
              value={pais}
              onChange={(e) => {
                setPais(e.target.value);
                setCidade("");
                setCidadeQuery("");
                setCidadeSuggestions([]);
                setPredictions([]);
                setValidSelection(false);
              }}
              className="mb-3"
            >
              <option value="ES">España</option>
              <option value="PT">Portugal</option>
            </Form.Select>

            {/* Cidade / Vila */}
            <Form.Control
              type="text"
              placeholder="Ex: Madrid"
              value={cidadeQuery}
              onChange={(e) => {
                setCidadeQuery(e.target.value);
                setValidSelection(false);
              }}
              autoFocus
              className="mb-1"
            />
            {cidadeSuggestions.length > 0 && (
              <ListGroup className="mb-3">
                {cidadeSuggestions.map((c) => (
                  <ListGroup.Item
                    key={c}
                    action
                    onClick={() => {
                      setCidade(c);
                      setCidadeQuery(c);
                      setCidadeSuggestions([]);
                    }}
                  >
                    {c}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}

            {/* Tipo de lugar */}
            <Form.Select
              value={tipoLugar}
              onChange={(e) => {
                setTipoLugar(e.target.value);
                setPredictions([]);
                setValidSelection(false);
              }}
              className="mb-3"
            >
              <option value="">Selecciona tipo de lugar</option>
              {TIPOS_LUGAR.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Form.Select>

            {/* Input do lugar */}
            <Form.Control
              type="text"
              placeholder="Ex: Auditorio Principal"
              value={inputLugar}
              onChange={(e) => setInputLugar(e.target.value)}
              disabled={!tipoLugar || !cidade}
            />

            {/* Lista de suxestións */}
            {predictions.length > 0 && (
              <ListGroup className="mt-2">
                {predictions.map((p: any) => (
                  <ListGroup.Item key={p.id} action onClick={() => handleSelectLugar(p)}>
                    {p.nome} — {p.cidade}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}

            <Button className="mt-4 w-100" disabled={!validSelection} onClick={() => navigate("/crear-evento/sala")}>
              Continuar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
