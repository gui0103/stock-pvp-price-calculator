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
				className="search-input"
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


