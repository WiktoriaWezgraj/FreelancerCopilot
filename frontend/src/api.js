export async function analyzeBrief(data) {
  try {
    const response = await fetch("http://localhost:3002/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Server error 500");
    }

    return await response.json();
  } catch (err) {
    console.error("Error in api.js:", err.message);
    throw err; // Przekazujemy błąd dalej do App.jsx
  }
}

export async function generateProposalDraft({
  briefText,
  experienceLevel,
  currency,
  analysis,
}) {
  const response = await fetch("http://localhost:3002/proposal", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      briefText,
      experienceLevel,
      currency,
      analysis,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to generate proposal draft.");
  }

  return data;
}