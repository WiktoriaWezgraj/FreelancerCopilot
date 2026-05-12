export async function analyzeBrief(data) {
  try {
    const response = await fetch("http://localhost:3002/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Błąd serwera 500");
    }

    return await response.json();
  } catch (err) {
    console.error("Błąd w api.js:", err.message);
    throw err; // Przekazujemy błąd dalej do App.jsx
  }
}