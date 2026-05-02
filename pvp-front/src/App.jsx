import { useState } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import ResultCard from './components/ResultCard';
import Loader from './components/Loader';

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (ticker) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data } = await axios.get(`${API_URL}/api/asset/${ticker}`);
      setResult(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.error ||
        'Ticker não encontrado ou erro na API.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.main}>
      <h1 style={styles.title}>📊 Calculadora P/VP</h1>
      <p style={styles.subtitle}>Ações e FIIs brasileiros</p>

      <SearchBar onSearch={handleSearch} loading={loading} />

      {loading && <Loader />}
      {error && <p style={styles.error}>{error}</p>}
      {result && <ResultCard data={result} />}
    </main>
  );
}

const styles = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    padding: '40px 16px',
    width: '100%',
    maxWidth: '520px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#888',
    marginTop: '-16px',
  },
  error: {
    color: '#ff6b6b',
    fontSize: '0.9rem',
    textAlign: 'center',
  },
};