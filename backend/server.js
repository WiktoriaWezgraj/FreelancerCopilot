import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();


if (!process.env.GEMINI_API_KEY) {
  console.error("ERROR: API key not found in .env file!");
} else {
  console.log("API key loaded successfully (first 7 characters):", process.env.GEMINI_API_KEY.substring(0, 7));
}


const app = express();
app.use(cors());
app.use(express.json());

// Ten endpoint pozwoli nam sprawdzić serwer w przeglądarce
app.get("/", (req, res) => {
  res.send("Backend operates on port 3002!");
});

app.post("/analyze", async (req, res) => {
  console.log("--> Query received!");
  try {
    const { briefText } = req.body;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Act as an IT expert. Analyze this client brief: ${briefText}. 
          Estimate the project for a ${req.body.experienceLevel} freelancer. 
          Respond ONLY in JSON format in English.
          JSON structure: {"price": "estimate in ${req.body.currency}", "timeline": "", "stack": [], "summary": ""}` }]}],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });

    const result = JSON.parse(data.candidates[0].content.parts[0].text);
    res.json(result);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3002, () => {
  console.log("SERVER START: http://localhost:3002");
});