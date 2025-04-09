import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Recommendations from './components/Recommendations';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post('https://shl-assessment-aof9.vercel.app/api/recommend', { prompt });
      console.log("👉 Gemini Response:", response.data); // ✅ Log response
      setResults(response.data.recommended_assessments || []);
      setError('');
    } catch (err) {
      setResults([]);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="content-wrapper">
        <header className="app-header">
          <div className="title-section">
            <h1>SHL Assessment Recommender</h1>
            <p>Enter a job description to get assessment recommendations</p>
          </div>
          <button 
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </header>

        <div className="input-card">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter job description..."
            rows={5}
            className="input-textarea"
          />
          <button 
            onClick={handleSubmit}
            disabled={loading || !prompt.trim()}
            className="submit-button"
          >
            {loading ? 'Processing...' : 'Get Recommendations'}
          </button>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        
        {results.length > 0 && (
          <div className="results-container">
            <Recommendations data={results} />
          </div>
        )}
      </div>
      <footer className="app-footer">
        © {new Date().getFullYear()} SHL Assessment Recommender
      </footer>
    </div>
  );
}

export default App;
