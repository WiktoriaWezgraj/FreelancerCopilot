import React, { useState } from "react";
import { analyzeBrief } from "./api";
import ResultCard from "./components/ResultCard";

export default function App() {
  const [briefText, setBriefText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    if (!briefText) return alert("Wpisz treść briefu!");
    
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
      alert("Błąd: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1>Freelancer Copilot</h1>
      <textarea
        style={{ width: "100%", padding: "10px", borderRadius: "8px" }}
        rows={10}
        placeholder="Wklej tutaj treść zlecenia od klienta..."
        value={briefText}
        onChange={(e) => setBriefText(e.target.value)}
      />
      <br /><br />
      <button 
        onClick={handleAnalyze} 
        disabled={loading}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        {loading ? "Analizuję (proszę czekać)..." : "Analizuj Brief"}
      </button>
      <hr style={{ margin: "30px 0" }} />
      {result && <ResultCard result={result} />}
    </div>
  );
}