const colorMap = {
	"Com desconto significativo": "#00d35f",
	"Leve desconto": "#a2ff6d",
	"No valor patrimonial": "#e2e8f0",
	"Negociando com prêmio": "#fb923c",
	"Cara (acima do VP)": "#f87171",
};
const getColor = (classification) => colorMap[classification] || "#e1e1e1";

export default function ResultCard({ data }) {
	const color = getColor(data.classification);

	return (
		<div style={styles.card}>
			<h2 style={styles.ticker}>{data.ticker}</h2>

			<div style={styles.pvpBlock}>
				<span style={styles.pvpLabel}>P/VP</span>
				<span style={{ ...styles.pvpValue, color }}>{data.pvp}</span>
			</div>

			<p style={{ ...styles.classification, color }}>{data.classification}</p>

			<div style={styles.divider} />

			<div style={styles.details}>
				<Detail
					label="Preço atual"
					value={`R$ ${data.currentPrice.toFixed(2)}`}
				/>
				<Detail
					label="Valor patrimonial"
					value={`R$ ${data.bookValuePerShare.toFixed(2)}`}
				/>
			</div>

			<p style={styles.date}>
				Calculado em {new Date(data.calculatedAt).toLocaleString("pt-BR")}
			</p>
		</div>
	);
}

function Detail({ label, value }) {
	return (
		<div style={styles.detailRow}>
			<span style={styles.detailLabel}>{label}</span>
			<span style={styles.detailValue}>{value}</span>
		</div>
	);
}

const styles = {
	card: {
		width: "100%",
		background: "#1a1a2e",
		border: "1px solid #2a2a3a",
		borderRadius: "16px",
		padding: "28px 24px",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		gap: "12px",
	},
	ticker: {
		fontSize: "1.6rem",
		fontWeight: "700",
		color: "#fff",
		letterSpacing: "2px",
	},
	pvpBlock: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		gap: "4px",
	},
	pvpLabel: {
		fontSize: "0.8rem",
		color: "#888",
		textTransform: "uppercase",
		letterSpacing: "1px",
	},
	pvpValue: {
		fontSize: "3rem",
		fontWeight: "800",
		lineHeight: 1,
	},
	classification: {
		fontSize: "1rem",
		fontWeight: "600",
	},
	divider: {
		width: "100%",
		height: "1px",
		background: "#2a2a3a",
		margin: "4px 0",
	},
	details: {
		width: "100%",
		display: "flex",
		flexDirection: "column",
		gap: "8px",
	},
	detailRow: {
		display: "flex",
		justifyContent: "space-between",
		fontSize: "0.9rem",
	},
	detailLabel: { color: "#888" },
	detailValue: { color: "#fff", fontWeight: "500" },
	date: {
		fontSize: "0.75rem",
		color: "#555",
		marginTop: "4px",
	},
};
