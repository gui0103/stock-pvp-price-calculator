import { useState } from "react";
import axios from "axios";
import SearchBar from "./components/SearchBar";
import ResultCard from "./components/ResultCard";
import Loader from "./components/Loader";
import HistoryList from "./components/HistoryList";
import { useHistory } from "./hooks/useHistory";

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
	const [result, setResult] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { history, addToHistory, clearHistory } = useHistory();

	const handleSearch = async (ticker) => {
		setLoading(true);
		setError(null);
		setResult(null);

		try {
			const { data } = await axios.get(`${API_URL}/api/asset/${ticker}`);
			setResult(data);
			addToHistory(data);
		} catch (err) {
			setError(
				err.response?.data?.detail ||
					err.response?.data?.error ||
					"Ticker não encontrado ou erro na API.",
			);
		} finally {
			setLoading(false);
		}
	};

	// Ao clicar no histórico, exibe o resultado sem chamar a API
	const handleSelectFromHistory = (item) => {
		setResult(item);
		setError(null);
	};

		return (
			<main className="app-main">
				<h1 className="app-title">📊 Calculadora P/VP</h1>
				<p className="app-subtitle">Ações e FIIs brasileiros</p>

				<SearchBar onSearch={handleSearch} loading={loading} />

				{loading && <Loader />}
				{error && <p className="app-error">{error}</p>}
				{result && <ResultCard data={result} />}

				{history.length > 0 && (
					<div className="app-history-header">
						<HistoryList history={history} onSelect={handleSelectFromHistory} />
						<button onClick={clearHistory} className="app-clear-button">
							Limpar histórico
						</button>
					</div>
				)}
			</main>
		);
}


