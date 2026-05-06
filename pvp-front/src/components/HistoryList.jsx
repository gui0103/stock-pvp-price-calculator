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
		<div className="historylist-wrapper">
			<h3 className="historylist-title">Histórico</h3>
			<div className="historylist-list history-scroll">
				{history.map((item) => {
					const color = getColor(item.classification);
					return (
						<button
							key={item.ticker}
							onClick={() => onSelect(item)}
							className="historylist-card"
						>
							<div className="historylist-dot" style={{ background: color }} />
							<span className="historylist-ticker">{item.ticker}</span>
							<span className="historylist-pvp" style={{ color }}>{item.pvp}</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}


