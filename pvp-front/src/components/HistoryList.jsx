const colorMap = {
	"Com desconto significativo": "#00d35f",
	"Leve desconto": "#a2ff6d",
	"No valor patrimonial": "#e2e8f0",
	"Negociando com prêmio": "#fb923c",
	"Cara (acima do VP)": "#f87171",
};

const getColor = (classification) => colorMap[classification] || "#e1e1e1";

export default function HistoryList({ history, onSelect }) {
	if (history.length === 0) return null;

	return (
		<div style={styles.wrapper}>
			<h3 style={styles.title}>Histórico</h3>
			<div style={styles.list}>
				{history.map((item) => {
					const color = getColor(item.classification);
					return (
						<button
							key={item.ticker}
							onClick={() => onSelect(item)}
							style={styles.card}
						>
							<div style={{ ...styles.dot, background: color }} />
							<span style={styles.ticker}>{item.ticker}</span>
							<span style={{ fontSize: "0.95rem", fontWeight: "700", color }}>
								{item.pvp}
							</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}

const styles = {
	wrapper: {
		width: "100%",
		display: "flex",
		flexDirection: "column",
		gap: "10px",
	},
	title: {
		fontSize: "0.8rem",
		color: "#555",
		textTransform: "uppercase",
		letterSpacing: "1px",
	},
	list: {
		display: "flex",
		flexDirection: "column",
		gap: "8px",
		maxHeight: "320px",
		overflowY: "auto",
	},
	card: {
		display: "flex",
		alignItems: "center",
		gap: "12px",
		padding: "10px 14px",
		background: "#1a1a2e",
		border: "1px solid #2a2a3a",
		borderRadius: "10px",
		cursor: "pointer",
		transition: "border-color 0.2s",
		width: "100%",
		textAlign: "left",
	},
	dot: {
		width: "10px",
		height: "10px",
		borderRadius: "50%",
		flexShrink: 0,
	},
	ticker: {
		flex: 1,
		color: "#fff",
		fontSize: "0.95rem",
		fontWeight: "600",
		letterSpacing: "1px",
	},
	pvp: {
		fontSize: "0.95rem",
		fontWeight: "700",
	},
};
