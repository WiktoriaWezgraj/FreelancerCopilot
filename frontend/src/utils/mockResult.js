export function createMockResult({ experienceLevel, currency }) {
  const priceByCurrency = {
    PLN: "3500–5500 PLN",
    EUR: "800–1300 EUR",
    USD: "900–1450 USD",
  };

  const readableExperienceLevel = {
    junior: "junior",
    mid: "mid-level",
    senior: "senior",
  };

  return {
    price: priceByCurrency[currency] || priceByCurrency.PLN,
    timeline: "2–3 weeks",
    stack: ["React", "Node.js", "Express", "REST API"],
    summary: `This is a mock analysis for a ${
      readableExperienceLevel[experienceLevel] || "mid-level"
    } freelancer. The project appears to be moderately complex and would likely require a responsive frontend, basic backend logic and API integration. The estimate is displayed in ${currency}.`,
    decision: "yes",
    decisionLabel: "Worth considering",
    riskArea:
      "The brief does not clearly define the final scope, exact deliverables, revision rounds and post-launch support expectations.",
  };
}