import React, { useEffect, useState } from "react";
import { analyzeBrief } from "./api";
import BriefForm from "./components/BriefForm";
import ResultCard from "./components/ResultCard";
import ThemeToggle from "./components/ThemeToggle";
import LoadingModal from "./components/LoadingModal";
import { createMockResult } from "./utils/mockResult";
import { applyTheme, getStoredTheme, saveTheme } from "./utils/themeStorage";
import { projectExamples } from "./data/examples";
import "./styles/App.css";

export default function App() {
  const [briefText, setBriefText] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("mid");
  const [currency, setCurrency] = useState("PLN");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(() => getStoredTheme() || "light");

  useEffect(() => {
    applyTheme(theme);
    saveTheme(theme);
  }, [theme]);

  async function handleAnalyze() {
    if (!briefText.trim()) {
      return alert("Please paste a client brief first.");
    }

    try {
      setLoading(true);

      const data = await analyzeBrief({
        briefText,
        experienceLevel,
        currency,
      });

      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleMockResult() {
    const mockData = createMockResult({
      experienceLevel,
      currency,
    });

    setResult(mockData);
  }

  function handleClear() {
    setResult(null);
  }

  function handleUseExample(description) {
    setBriefText(description);
    setResult(null);
  }

  function handleToggleTheme() {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  }

 return (
  <main className="app">
    <LoadingModal isOpen={loading} />

    <div className="app-shell">
      <div className="top-bar">
        <div className="app-badge">
          <span className="app-badge-dot" />
          AI-powered brief analysis
        </div>

        <ThemeToggle theme={theme} onToggle={handleToggleTheme} />
      </div>

      <header className="app-header">
        <h1>Freelancer Copilot</h1>
        <p>
          Paste a client brief, choose your experience level and select the
          estimation currency. The app will help you prepare an early project
          estimate.
        </p>
      </header>

      <section className="examples-section">
        <p className="examples-label">Or use an example:</p>

        <div className="examples-grid">
          {projectExamples.map((example) => (
            <button
              key={example.id}
              type="button"
              className="example-card"
              onClick={() => handleUseExample(example.description)}
            >
              <strong>{example.title}</strong>
              <span>{example.description}</span>
            </button>
          ))}
        </div>
      </section>

      <BriefForm
        briefText={briefText}
        setBriefText={setBriefText}
        experienceLevel={experienceLevel}
        setExperienceLevel={setExperienceLevel}
        currency={currency}
        setCurrency={setCurrency}
        loading={loading}
        onAnalyze={handleAnalyze}
        onMockResult={handleMockResult}
        onClear={handleClear}
      />

      <hr className="divider" />

      {result ? (
        <ResultCard result={result} />
      ) : (
        <div className="empty-state">
          Run a mock analysis to preview the result card, or connect the API
          key and analyze a real client brief.
        </div>
      )}
    </div>
  </main>
);
}