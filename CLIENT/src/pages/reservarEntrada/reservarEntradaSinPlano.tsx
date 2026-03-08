import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { FaCalendarAlt, FaTicketAlt, FaExclamationTriangle } from "react-icons/fa";
import MainNavbar from "../componentes/NavBar";

interface Evento {
	id: number;
	imaxe_evento?: string | null;
	nome_evento: string;
	descripcion_evento?: string;
	data_evento: string;
	localizacion: string;
	entradas_venta: number;
	entradas_reservadas?: number;
	entradas_vendidas?: number;
	prezo_evento?: number;
	procedimiento_cobro_manual?: string | null;
}

export default function ReservarEntradaSinPlano() {
	const { id } = useParams<{ id: string }>();
	const [evento, setEvento] = useState<Evento | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [cantidadeReservar, setCantidadeReservar] = useState<number>(0);
	const [nomeXeral, setNomeXeral] = useState("");
	const [nomearTodas, setNomearTodas] = useState(false);
	const [nomesInvitacions, setNomesInvitacions] = useState<string[]>([]);
	const [gardando, setGardando] = useState(false);
	const [cargandoInvitacions, setCargandoInvitacions] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const navigate = useNavigate();
	const API_BASE_URL = "http://localhost:8000";

	useEffect(() => {
		if (!id) return;

		const fetchEvento = async () => {
			setLoading(true);
			try {
				const resp = await fetch(`http://localhost:8000/crear-eventos/publico/${id}/`);
				if (!resp.ok) throw new Error("Evento non atopado");
				const data = await resp.json();
				setEvento(data);
			} catch (e: any) {
				console.error(e);
				setError(e.message || "Erro ao cargar evento");
			} finally {
				setLoading(false);
			}
		};

		fetchEvento();
	}, [id]);

	useEffect(() => {
		if (!id) return;

		const cargarInvitacions = async () => {
			setCargandoInvitacions(true);
			try {
				const token = localStorage.getItem("access_token");
				const resp = await fetch(`${API_BASE_URL}/crear-eventos/${id}/invitacions-sen-plano/`, {
					headers: {
						...(token ? { Authorization: `Bearer ${token}` } : {}),
					},
				});

				if (!resp.ok) {
					throw new Error("Non se puideron cargar as invitacións");
				}
			} catch (e: any) {
				setError(e.message || "Erro ao cargar invitacións");
			} finally {
				setCargandoInvitacions(false);
			}
		};

		cargarInvitacions();
	}, [id]);

	useEffect(() => {
		if (!nomearTodas) return;
		setNomesInvitacions((prev) => {
			const trimmed = prev.slice(0, cantidadeReservar);
			while (trimmed.length < cantidadeReservar) {
				trimmed.push("");
			}
			return trimmed;
		});
	}, [cantidadeReservar, nomearTodas]);

	useEffect(() => {
		if (cantidadeReservar <= 1 && nomearTodas) {
			setNomearTodas(false);
		}
	}, [cantidadeReservar, nomearTodas]);

	const handleCantidadeChange = (value: string) => {
		const parsed = Number.parseInt(value, 10);
		if (Number.isNaN(parsed)) {
			setCantidadeReservar(0);
			return;
		}
		setCantidadeReservar(Math.max(0, parsed));
	};

	const handleNomeInvitacionChange = (idx: number, value: string) => {
		setNomesInvitacions((prev) => {
			const next = [...prev];
			next[idx] = value;
			return next;
		});
	};

	const limparFormulario = () => {
		setCantidadeReservar(0);
		setNomeXeral("");
		setNomesInvitacions([]);
		setNomearTodas(false);
	};

	const isFormValid = () => {
		if (cantidadeReservar <= 0) {
			return false;
		}

		if (nomearTodas) {
			const nomesValidos = nomesInvitacions.slice(0, cantidadeReservar);
			return nomesValidos.every((nome) => nome.trim().length > 0);
		}

		return nomeXeral.trim().length > 0;
	};

	const gardarReserva = async () => {
		setError(null);

		if (!evento) return;

		if (cantidadeReservar < 0) {
			setError("A cantidade de entradas reservadas non pode ser negativa.");
			limparFormulario();
			return;
		}

		if (nomearTodas && cantidadeReservar > 0 && nomesInvitacions.length !== cantidadeReservar) {
			setError("Revisa os nomes das invitacións antes de gardar.");
			limparFormulario();
			return;
		}

		setGardando(true);
		try {
			const token = localStorage.getItem("access_token");
			const nomesParaGardar = nomearTodas ? nomesInvitacions.slice(0, cantidadeReservar) : [];

			const resp = await fetch(`${API_BASE_URL}/crear-eventos/${evento.id}/invitacions-sen-plano/`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					...(token ? { Authorization: `Bearer ${token}` } : {}),
				},
				body: JSON.stringify({
					cantidade: cantidadeReservar,
					nomes: nomesParaGardar,
					nome_xeral: nomeXeral,
				}),
			});

			if (!resp.ok) {
				const data = await resp.json().catch(() => null);
				throw new Error(data?.detail || data?.error || "Non se puideron gardar as entradas reservadas.");
			}

			setShowModal(true);
			limparFormulario();
		} catch (e: any) {
			setError(e.message || "Produciuse un erro ao gardar as invitacións.");
			limparFormulario();
		} finally {
			setGardando(false);
		}
	};

	if (loading) return <div className="container py-4">Cargando evento...</div>;
	if (error) return <div className="container py-4 text-danger">{error}</div>;
	if (!evento) return <div className="container py-4">Evento non encontrado</div>;

	const formatDataCompleta = (dateString: string) => {
		const date = new Date(dateString);

		const data = new Intl.DateTimeFormat("gl-ES", {
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric",
		}).format(date);

		const hora = new Intl.DateTimeFormat("gl-ES", {
			hour: "2-digit",
			minute: "2-digit",
		}).format(date);

		const dataCapitalizada = data.charAt(0).toUpperCase() + data.slice(1);
		return `${dataCapitalizada} as ${hora}`;
	};

	const dataFormato = formatDataCompleta(evento.data_evento);

	return (
		<>
			<MainNavbar />
			<div className="container py-4">
				<div className="card shadow-sm">
					<div className="p-3">
						<div className="d-flex align-items-start pb-2 mb-3">
							<Button className="volver-verde-btn me-3" onClick={() => navigate(-1)}>
								← Volver
							</Button>
							<div className="flex-grow-1 text-center">
								<h2 className="m-0 mb-2">{evento.nome_evento}</h2>
								<p className="text-center mb-1 mt-0">
									<FaCalendarAlt className="me-1" />
									{dataFormato}
								</p>
								<p className="text-center mb-0 mt-0">
									<strong>{evento.localizacion}</strong>
								</p>
							</div>
							<div style={{ width: "100px" }}></div>
						</div>
					</div>

					<div className="card-body">
						{cargandoInvitacions && <p className="text-muted">Cargando invitacións...</p>}

						<div className="mb-3" style={{ maxWidth: "400px" }}>
							<label htmlFor="cantidade-reserva" className="form-label">
								Cantas invitacións novas queres engadir?
							</label>
							<input
								id="cantidade-reserva"
								type="number"
								min={0}
								value={cantidadeReservar > 0 ? cantidadeReservar : ""}
								onChange={(e) => handleCantidadeChange(e.target.value)}
								className="form-control"
								placeholder="Introduce o numero de entradas a reservar"
							/>
						</div>

						{!nomearTodas && (
							<div className="mb-3" style={{ maxWidth: "400px" }}>
								<label htmlFor="nome-xeral" className="form-label">
									Nome xeral para as invitacións
								</label>
								<input
									id="nome-xeral"
									type="text"
									value={nomeXeral}
									onChange={(e) => setNomeXeral(e.target.value)}
									className="form-control"
									placeholder="Nome da reserva"
								/>
							</div>
						)}

						{cantidadeReservar > 1 && (
							<div className="form-check mb-3">
								<input
									id="nomear-todas"
									type="checkbox"
									className="form-check-input checkbox-verde"
									checked={nomearTodas}
									onChange={(e) => setNomearTodas(e.target.checked)}
								/>
								<label htmlFor="nomear-todas" className="form-check-label">
									Quero nomear todas as invitacións individualmente
								</label>
							</div>
						)}

						{nomearTodas && cantidadeReservar > 0 && (
							<div className="mb-3">
								<p className="mb-2">Nomes das invitacións</p>
								<div className="d-grid" style={{ gap: "8px" }}>
									{Array.from({ length: cantidadeReservar }).map((_, idx) => (
										<input
											key={`invitacion-${idx}`}
											type="text"
											className="form-control"
											placeholder={`Nome invitacion ${idx + 1}`}
											value={nomesInvitacions[idx] || ""}
											onChange={(e) => handleNomeInvitacionChange(idx, e.target.value)}
										/>
									))}
								</div>
							</div>
						)}

						{evento.procedimiento_cobro_manual && (
							<div className="mt-3">
								<strong>Procedemento para o pago: </strong>
								{evento.procedimiento_cobro_manual}
							</div>
						)}

						{evento.prezo_evento != null && (
							<p className="mt-3 mb-4">
								<FaTicketAlt className="me-1" />
								<strong>Prezo: </strong>
								{evento.prezo_evento} €
							</p>
						)}

						<div className="d-flex justify-content-start">
							<button
								type="button"
								className="reserva-entrada-verde-btn"
								onClick={gardarReserva}
								disabled={gardando || !isFormValid()}
							>
								{gardando ? "Gardando..." : "Reservar Entradas"}
							</button>
						</div>

						{error && (
							<div style={{ color: "#ff0093", fontWeight: "bold", marginTop: "12px" }}>
								{error}
							</div>
						)}
					</div>
				</div>
			</div>

			<Modal show={showModal} onHide={() => setShowModal(false)} centered>
				<Modal.Header closeButton>
					<Modal.Title>✓ Entradas Reservadas</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{evento?.procedimiento_cobro_manual && (
						<div className="d-flex align-items-start">
							<FaExclamationTriangle style={{ fontSize: "1.5em", marginRight: "12px", color: "#000", marginTop: "4px" }} />
							<div className="flex-grow-1">
								<strong style={{ fontSize: "1.2em" }}>Procedemento para o pago:</strong>
								<p className="mt-2 mb-0">{evento.procedimiento_cobro_manual}</p>
							</div>
						</div>
					)}
				</Modal.Body>
				<Modal.Footer>
					<button className="reserva-entrada-verde-btn" onClick={() => setShowModal(false)}>
						Entendido
					</button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
