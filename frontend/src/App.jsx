import React, { useState } from "react";
import { analyzeBrief } from "./api";
import BriefForm from "./components/BriefForm";
import ResultCard from "./components/ResultCard";
import { createMockResult } from "./utils/mockResult";
import "./styles/App.css";
import { projectExamples } from "./data/examples";

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

        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "14px", marginBottom: "10px", color: "#555" }}>
            Or use an example:
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {projectExamples.map((ex) => (
              <button
                key={ex.id}
                onClick={() => setBriefText(ex.description)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  fontSize: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  backgroundColor: "#fff",
                  textAlign: "left",
                  flex: "1",
                  minWidth: "150px",
                  transition: "background 0.2s"
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f9f9f9")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
              >
                <strong style={{ display: "block", marginBottom: "4px" }}>{ex.title}</strong>
                <span style={{ 
                  display: "-webkit-box", 
                  WebkitLineClamp: "2", 
                  WebkitBoxOrient: "vertical", 
                  overflow: "hidden", 
                  color: "#777" 
                }}>
                  {ex.description}
                </span>
              </button>
            ))}
          </div>
        </div>

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