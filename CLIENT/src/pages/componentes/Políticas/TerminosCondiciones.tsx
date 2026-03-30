import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import MainNavbar from "../NavBar";
import Footer from "../footer";

const termsSections = [
	{
		title: "1. Obxecto da plataforma e aceptación",
		paragraphs: [
			"Estas condicións regulan o acceso, navegación e uso da plataforma brasinda.com, así como os servizos de publicación de xestión de eventos por parte dos organizadores, e reserva ou compra de entradas por parte de usuarios.",
			"O uso da plataforma implica a aceptación plena destas condicións. Se non estás de acordo con algunha delas, debes absterte de utilizar os servizos.",
		],
	},
	{
		title: "2. Identificación do titular",
		paragraphs: [
			"Titular: Brasinda S.L.",
			"Enderezo: Avenida de Castela Nº 151, Verín (Ourense).",
			"Correo electrónico: info@brasinda.com.",
			"Dominios: brasinda.com, brasinda.es e brasinda.pt.",
		],
	},
	{
		title: "3. Rexistro e conta de usuario",
		paragraphs: [
			"Para acceder a determinadas funcionalidades pode ser necesario rexistrarse e facilitar datos veraces, completos e actualizados.",
			"A persoa usuaria é responsable de custodiar as súas credenciais e de toda actividade realizada desde a súa conta.",
            "A idade mínima para utilizar a plataforma é de 18 anos.",
			"A plataforma poderá suspender ou cancelar contas cando detecte uso fraudulento, incumprimento destas condicións ou riscos para a seguridade do servizo.",
		],
	},
	{
		title: "4. Publicación de eventos e responsabilidade do organizador",
		paragraphs: [
			"O organizador garante que dispón de lexitimación para publicar o evento e comprométese a que a información sexa exacta, clara e non enganosa.",
			"A organización, seguridade, permisos, licenzas, seguros e cumprimento normativo do evento son responsabilidade exclusiva do organizador.",
			"En caso de cancelación, modificación substancial ou incidencia relevante, o organizador deberá informar con dilixencia e asumir as obrigas de devolución que correspondan legalmente.",
		],
	},
	{
		title: "5. Compra e reserva de entradas",
		paragraphs: [
			"As entradas están suxeitas á dispoñibilidade en tempo real e ao pagamento correcto cando corresponda.",
			"Antes de confirmar unha compra ou reserva, a persoa usuaria debe revisar os datos do evento, prezo, data, localización e condicións específicas publicadas polo organizador.",
			"Unha vez completada a operación, a plataforma poderá enviar confirmación por correo electrónico e permitir a descarga da entrada en formato dixital.",
		],
	},
	{
		title: "6. Prezos, pagamentos e reembolsos",
		paragraphs: [
			"Os prezos mostrados inclúen os importes indicados na ficha do evento. No caso de existir cargos adicionais, serán informados antes da confirmación.",
			"Os pagamentos procesaranse a través dos provedores habilitados na plataforma e baixo os seus propios estándares de seguridade.",
			"As políticas de cancelación e reembolso dependerán da natureza do evento e da normativa aplicable. Cando proceda, o reembolso realizarase polo mesmo medio de pagamento empregado na compra.",
		],
	},
	{
		title: "7. Uso permitido e prohibicións",
		paragraphs: [
			"Queda prohibido utilizar a plataforma para fins ilícitos, fraudulentos, difamatorios, discriminatorios ou que vulneren dereitos de terceiros.",
			"Non está permitido manipular o funcionamento técnico do servizo, acceder sen autorización a sistemas, nin empregar bots ou scripts para alterar a compra de entradas.",
			"A plataforma resérvase o dereito de limitar, suspender ou bloquear o acceso ante condutas abusivas ou incumprimentos graves.",
		],
	},
	{
		title: "8. Propiedade intelectual e industrial",
		paragraphs: [
			"Os contidos, deseños, marcas, logos, software e elementos gráficos da plataforma son titularidade do responsable ou de terceiros licenciantes e están protexidos pola normativa de propiedade intelectual e industrial.",
			"Non se concede ningún dereito de explotación sobre estes elementos máis alá do uso estritamente necesario para navegar e utilizar os servizos conforme ás presentes condicións.",
		],
	},
	{
		title: "9. Dispoñibilidade do servizo",
		paragraphs: [
			"A plataforma procurará manter a continuidade e seguridade do servizo, pero non garante a dispoñibilidade permanente nin a ausencia total de erros técnicos ou interrupcións.",
			"Poderán realizarse tarefas de mantemento, actualizacións ou melloras que limiten temporalmente o acceso, sen que isto xere dereito a indemnización.",
		],
	},
	{
		title: "10. Protección de datos e cookies",
		paragraphs: [
			"O tratamento de datos persoais rexerase pola Política de Privacidade e, no relativo a cookies e tecnoloxías semellantes, pola Política de Cookies publicadas na plataforma.",
		],
	},
	{
		title: "11. Modificación das condicións",
		paragraphs: [
			"O titular poderá modificar estas condicións para adaptalas a cambios legais, técnicos ou operativos. As novas versións publicaranse nesta mesma páxina e entrarán en vigor desde a súa publicación.",
			"Última actualización: 30 de marzo de 2026.",
		],
	},
	{
		title: "12. Lei aplicable e xurisdición",
		paragraphs: [
			"Estas condicións rexeranse pola lexislación española. Para a resolución de conflitos, as partes someteranse aos xulgados e tribunais competentes conforme á normativa vixente en materia de consumo e contratación.",
		],
	},
];

function TerminosCondiciones() {
	const navigate = useNavigate();

	return (
		<>
			<MainNavbar />

			<div
				style={{
					background:
						"linear-gradient(180deg, rgba(255,0,147,0.08) 0%, rgba(255,255,255,1) 55%)",
					padding: "3rem 0 1rem",
				}}
			>
				<Container style={{ maxWidth: "960px" }}>
					<div
						style={{
							backgroundColor: "#ffffff",
							borderRadius: "28px",
							padding: "2.5rem",
							boxShadow: "0 18px 45px rgba(23, 30, 60, 0.08)",
							border: "1px solid rgba(255, 0, 147, 0.08)",
						}}
					>
						<p
							style={{
								color: "#ff0093",
								fontWeight: 700,
								textTransform: "uppercase",
								letterSpacing: "0.08em",
								marginBottom: "0.75rem",
								fontSize: "0.85rem",
							}}
						>
							Información legal
						</p>

						<h1
							style={{
								fontSize: "clamp(2rem, 4vw, 3.4rem)",
								fontWeight: 800,
								color: "#171717",
								marginBottom: "1rem",
							}}
						>
							Termos e condicións de uso
						</h1>

						<p
							style={{
								fontSize: "1.05rem",
								lineHeight: 1.8,
								color: "#4b5563",
								maxWidth: "760px",
								marginBottom: "1.5rem",
							}}
						>
							Este documento regula os dereitos e obrigas das persoas usuarias,
							organizadores e titular da plataforma no uso dos servizos de
							publicación e reserva de eventos.
						</p>

						<Button
							variant="outline-dark"
							onClick={() => navigate(-1)}
							style={{ borderRadius: "999px", padding: "0.65rem 1.25rem" }}
						>
							Volver
						</Button>
					</div>

					<div style={{ marginTop: "1.5rem", display: "grid", gap: "1rem" }}>
						{termsSections.map((section) => (
							<section
								key={section.title}
								style={{
									backgroundColor: "#ffffff",
									borderRadius: "22px",
									padding: "1.75rem 1.5rem",
									border: "1px solid #ececf2",
									boxShadow: "0 12px 30px rgba(15, 23, 42, 0.04)",
								}}
							>
								<h2
									style={{
										fontSize: "1.2rem",
										fontWeight: 700,
										color: "#111827",
										marginBottom: "0.9rem",
									}}
								>
									{section.title}
								</h2>

								{section.paragraphs.map((paragraph) => (
									<p
										key={paragraph}
										style={{
											marginBottom: "0.9rem",
											color: "#4b5563",
											lineHeight: 1.8,
										}}
									>
										{paragraph}
									</p>
								))}
							</section>
						))}
					</div>
				</Container>
			</div>

			<Footer />
		</>
	);
}

export default TerminosCondiciones;
