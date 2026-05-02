import { useState } from "react";

export default function SearchBar({ onSearch, loading }) {
	const [ticker, setTicker] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		if (ticker.trim()) onSearch(ticker.trim().toUpperCase());
	};

	return (
		<form onSubmit={handleSubmit} className="search-form">
			<input
				type="text"
				value={ticker}
				onChange={(e) => setTicker(e.target.value.toUpperCase())}
				placeholder="Ex: ALZR11, PETR4..."
				maxLength={7}
				disabled={loading}
				style={styles.input}
			/>
			<button
				type="submit"
				disabled={loading || !ticker.trim()}
                className="search-button"
			>
				{loading ? "..." : "Buscar"}
			</button>
		</form>
	);
}

const styles = {
	input: {
		flex: 1,
		padding: "12px 16px",
		borderRadius: "10px",
		border: "1px solid #2a2a3a",
		background: "#1a1a2e",
		color: "#fff",
		fontSize: "1rem",
		outline: "none",
		letterSpacing: "1px",
	},
};
