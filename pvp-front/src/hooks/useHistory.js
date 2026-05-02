import { useState, useEffect } from "react";

const STORAGE_KEY = "pvp_history";
const MAX_ITEMS = 30;

export function useHistory() {
	const [history, setHistory] = useState(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			return stored ? JSON.parse(stored) : [];
		} catch {
			return [];
		}
	});

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
	}, [history]);

	const addToHistory = (result) => {
		setHistory((prev) => {
			// Remove entrada antiga do mesmo ticker se existir
			const filtered = prev.filter((item) => item.ticker !== result.ticker);
			// Adiciona no topo e limita a 30
			return [result, ...filtered].slice(0, MAX_ITEMS);
		});
	};

	const clearHistory = () => setHistory([]);

	return { history, addToHistory, clearHistory };
}
