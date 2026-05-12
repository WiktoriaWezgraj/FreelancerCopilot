import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Ten endpoint pozwoli nam sprawdzić serwer w przeglądarce
app.get("/", (req, res) => {
  res.send("Backend dziala na porcie 3002!");
});

app.post("/analyze", async (req, res) => {
  console.log("--> Zapytanie odebrane!");
  try {
    const { briefText } = req.body;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Analiza briefu: ${briefText}. Zwroc JSON: {"price":"","timeline":"","stack":[],"summary":""}` }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });

    const result = JSON.parse(data.candidates[0].content.parts[0].text);
    res.json(result);
  } catch (err) {
    console.error("Blad:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3002, () => {
  console.log("SERWER START: http://localhost:3001");
});