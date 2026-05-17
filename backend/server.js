import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.error("ERROR: API key not found in .env file!");
} else {
  console.log("API key loaded successfully");
}

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.send(`Backend operates on port ${PORT}!`);
});

app.post("/analyze", async (req, res) => {
  console.log("--> Analysis request received!");

  try {
    const {
      briefText,
      experienceLevel = "mid",
      currency = "PLN",
    } = req.body;

    if (!briefText || !briefText.trim()) {
      return res.status(400).json({
        error: "Brief text is required.",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "Missing GEMINI_API_KEY in backend .env file.",
      });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const prompt = `
You are an AI assistant for freelancers. Your task is to analyze a client project brief and support a freelancer in deciding whether the project is worth taking.

Analyze the project from the perspective of a ${experienceLevel} freelancer.
Return all price estimates in ${currency}.
Respond in English.

Client brief:
"""
${briefText}
"""

Return ONLY a valid JSON object.
Do not include markdown.
Do not include code fences.
Do not include additional explanation outside the JSON.

The JSON must follow exactly this structure:
{
  "price": "string with estimated price range in ${currency}",
  "timeline": "string with estimated delivery time",
  "stack": ["array", "of", "recommended", "technologies"],
  "summary": "short but useful summary of the project analysis",
  "decision": "yes | no | maybe",
  "decisionLabel": "short label, for example: Worth considering, Needs clarification, Too risky",
  "riskArea": "short explanation of the most important risk or uncertainty",
  "risks": [
    {
      "category": "Missing details | Budget mismatch | Scope creep | Timeline risk | Technical complexity | Integration risk | Client communication risk | Maintenance/support risk",
      "description": "short practical explanation of the risk"
    }
  ],
  "missingDetails": [
    "question or missing information that the freelancer should clarify with the client"
  ]
}

Decision rules:
- Use "yes" if the project seems realistic, valuable and reasonably scoped for the selected experience level.
- Use "maybe" if the project might be worth taking, but requires clarification before accepting.
- Use "no" if the project seems too risky, underdefined, unrealistic or unsuitable for the selected experience level.

Risk recognition guidelines:
- Identify missing project details, such as platform specification, required features, user roles, integrations, hosting, maintenance, content ownership or design assets.
- Identify possible budget mismatch, especially when the requested scope seems too complex for the likely or stated budget.
- Identify scope creep risk, meaning the project may grow beyond the original scope because requirements are vague, too broad or not prioritized.
- Identify timeline risk if the expected deadline seems too short for the requested features.
- Identify technical complexity risk if the project requires advanced integrations, payments, authentication, admin panels, real-time features, PDF generation, external APIs or production-grade security.
- Identify maintenance and support risk if the client may expect post-launch support, updates or hosting without clearly defining it.

Keep the response practical, concise and useful for a freelance developer.
Limit risks to 2-4 most important items.
Limit missingDetails to 3-6 most important questions.
`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({
        error: data.error.message,
      });
    }

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res.status(500).json({
        error: "Gemini returned an empty or invalid response.",
      });
    }

    const result = JSON.parse(rawText);

    res.json({
      price: result.price || "No data",
      timeline: result.timeline || "No data",
      stack: Array.isArray(result.stack) ? result.stack : [],
      summary: result.summary || "No summary available",
      decision: normalizeDecision(result.decision),
      decisionLabel: result.decisionLabel || "Needs clarification",
      riskArea: result.riskArea || "No major risks identified.",
      risks: normalizeRisks(result.risks),
      missingDetails: normalizeMissingDetails(result.missingDetails),
    });
  } catch (err) {
    console.error("Error:", err.message);

    res.status(500).json({
      error: err.message,
    });
  }
});

app.post("/proposal", async (req, res) => {
  console.log("--> Proposal draft request received!");

  try {
    const {
      briefText,
      experienceLevel = "mid",
      currency = "PLN",
      analysis,
    } = req.body;

    if (!briefText || !briefText.trim()) {
      return res.status(400).json({
        error: "Brief text is required to generate a proposal draft.",
      });
    }

    if (!analysis) {
      return res.status(400).json({
        error: "Analysis result is required to generate a proposal draft.",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "Missing GEMINI_API_KEY in backend .env file.",
      });
    }

    const firstDraft = await generateProposalText({
      briefText,
      experienceLevel,
      currency,
      analysis,
      attempt: 1,
    });

    let finalDraft = firstDraft;

    if (isProposalTooShort(firstDraft)) {
      console.log("Proposal draft was too short. Retrying...");

      finalDraft = await generateProposalText({
        briefText,
        experienceLevel,
        currency,
        analysis,
        attempt: 2,
      });
    }

    if (isProposalTooShort(finalDraft)) {
      return res.status(500).json({
        error:
          "Gemini returned a proposal draft that was too short. Please try again.",
      });
    }

    console.log("Proposal draft generated successfully.");
    console.log("Final proposal draft length:", finalDraft.length);

    res.json({
      subjectLine: createProposalSubjectLine(briefText, analysis),
      proposalDraft: finalDraft.trim(),
    });
  } catch (err) {
    console.error("Proposal error:", err.message);

    res.status(500).json({
      error: err.message,
    });
  }
});

function normalizeDecision(decision) {
  const allowedDecisions = ["yes", "no", "maybe"];

  if (allowedDecisions.includes(decision)) {
    return decision;
  }

  return "maybe";
}

function normalizeRisks(risks) {
  if (!Array.isArray(risks)) {
    return [];
  }

  return risks
    .filter((risk) => risk && typeof risk === "object")
    .map((risk) => ({
      category: risk.category || "General risk",
      description: risk.description || "No description provided.",
    }));
}

function normalizeMissingDetails(missingDetails) {
  if (!Array.isArray(missingDetails)) {
    return [];
  }

  return missingDetails.filter((item) => typeof item === "string" && item.trim());
}

async function generateProposalText({
  briefText,
  experienceLevel,
  currency,
  analysis,
  attempt,
}) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const prompt = `
You are writing a professional client-facing proposal message for a freelance developer.

Write a complete proposal draft in English.

Important:
- Return only the proposal message text.
- Do not return JSON.
- Do not include a subject line.
- Do not use markdown headings.
- Do not use code fences.
- Do not stop mid-sentence.
- Finish with a complete professional closing.
- Do not add a fake freelancer name.
- Do not write placeholders such as [Client Name].

Style:
- Natural, professional, clear and helpful.
- Not too salesy, avoid generic sales phrases such as 'bringing your vision to life'.
- Avoid repeating the same project description twice.
- Keep the message practical and specific.
- Honest about uncertainty- mention the main project risk briefly but professionally.
- Do not overpromise.
- Do not invent confirmed requirements.

Freelancer experience level: ${experienceLevel}
Currency: ${currency}

Client brief:
"""
${briefText}
"""

Previous project analysis:
"""
${JSON.stringify(analysis, null, 2)}
"""

Write the proposal as 5 short paragraphs:

Paragraph 1:
Thank the client and briefly refer to the project.

Paragraph 2:
Show that you understand the project scope.

Paragraph 3:
Mention the preliminary timeline and budget estimate from the analysis.
Make it clear this is not a final quote.

Paragraph 4:
Suggest next steps and explain what should be clarified before final pricing.

Paragraph 5:
End with a short professional closing.

Also include 2-4 polite clarification questions inside the message.

Length:
- ${attempt === 1 ? "170-230 words" : "140-190 words"}.
- Complete message.
- No unfinished sentences.
`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 2000,
        temperature: 0.4,
      },
    }),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  const candidate = data.candidates?.[0];
  const proposalDraft = candidate?.content?.parts?.[0]?.text || "";

  console.log(`Proposal attempt ${attempt} finish reason:`, candidate?.finishReason);
  console.log(`Proposal attempt ${attempt} length:`, proposalDraft.length);
  console.log(`Proposal attempt ${attempt} preview:`, proposalDraft.slice(0, 250));

  return proposalDraft.trim();
}

function isProposalTooShort(proposalDraft) {
  if (!proposalDraft || proposalDraft.length < 650) {
    return true;
  }

  const trimmed = proposalDraft.trim();

  const endsProperly =
    trimmed.endsWith(".") ||
    trimmed.endsWith("!") ||
    trimmed.endsWith("?");

  return !endsProperly;
}

function createProposalSubjectLine(briefText, analysis) {
  const summary = analysis?.summary || "";
  const text = `${summary} ${briefText}`.toLowerCase();

  if (text.includes("wordpress") && text.includes("book")) {
    return "Proposal: WordPress E-book & Video Store Development";
  }

  if (text.includes("e-commerce") || text.includes("online store")) {
    return "Proposal: E-commerce Website Development";
  }

  if (text.includes("crm")) {
    return "Proposal: CRM Platform Development";
  }

  if (text.includes("saas")) {
    return "Proposal: SaaS Platform Development";
  }

  if (text.includes("landing page") || text.includes("one-page")) {
    return "Proposal: Landing Page Development";
  }

  if (text.includes("portfolio")) {
    return "Proposal: Portfolio Website Development";
  }

  return "Proposal: Project Development Estimate";
}

app.listen(PORT, () => {
  console.log(`SERVER START: http://localhost:${PORT}`);
});