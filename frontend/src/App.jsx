import React, { useState } from "react";
import { analyzeBrief } from "./api";
import ResultCard from "./components/ResultCard";
import { projectExamples } from "./data/examples";

export default function App() {
  const [briefText, setBriefText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    if (!briefText) return alert("Paste the client's brief here!");
    
    try {
      setLoading(true);
      const data = await analyzeBrief({
        briefText,
        seniority: "mid",
        currency: "PLN"
      });
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1>Freelancer Copilot</h1>
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        {projectExamples.map((ex) => (
          <button 
            key={ex.id} 
            onClick={() => setBriefText(ex.description)}
            style={{ padding: "5px 10px", cursor: "pointer", fontSize: "12px" }}
          >
            {ex.title}<br />
        
            {ex.description}
          </button>
        ))}
      </div>
      <textarea
        style={{ width: "100%", padding: "10px", borderRadius: "8px" }}
        rows={10}
        placeholder="Paste the client's brief here..."
        value={briefText}
        onChange={(e) => setBriefText(e.target.value)}
      />
      <br /><br />
      <button 
        onClick={handleAnalyze} 
        disabled={loading}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        {loading ? "Analizing (please wait)..." : "Analize Brief"}
      </button>
      <hr style={{ margin: "30px 0" }} />
      {result && <ResultCard result={result} />}
    </div>
  );
}