import React, { useState } from "react";
import { analyzeBrief } from "./api";
import BriefForm from "./components/BriefForm";
import ResultCard from "./components/ResultCard";
import { createMockResult } from "./utils/mockResult";
import "./styles/App.css";

export default function App() {
  const [briefText, setBriefText] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("mid");
  const [currency, setCurrency] = useState("PLN");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

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
    setBriefText("");
    setExperienceLevel("mid");
    setCurrency("PLN");
    setResult(null);
  }

  return (
    <main className="app">
      <div className="app-shell">
        <header className="app-header">
          <div className="app-badge">
            <span className="app-badge-dot" />
            AI-powered brief analysis
          </div>

          <h1>Freelancer Copilot</h1>
          <p>
            Paste a client brief, choose your experience level and select the
            estimation currency. The app will help you prepare an early project
            estimate.
          </p>
        </header>

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