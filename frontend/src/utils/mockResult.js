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
    decision: "maybe",
    decisionLabel: "Needs clarification",
    riskArea:
      "The main risk is that the brief describes several features but does not clearly define the final scope, budget and delivery expectations.",
    risks: [
      {
        category: "Missing details",
        description:
          "The brief does not specify the exact number of pages, user roles, content ownership, hosting requirements or final deliverables.",
      },
      {
        category: "Scope creep",
        description:
          "The project may grow beyond the original scope if features such as admin panel, integrations or revisions are not clearly limited.",
      },
      {
        category: "Budget mismatch",
        description:
          "The expected scope may require more time and budget than a client usually expects from a simple freelance project.",
      },
    ],
    missingDetails: [
      "What is the expected budget range for the project?",
      "Which features are required for the first version or MVP?",
      "Who will provide the content, images, branding and copy?",
      "Does the client expect hosting, deployment or post-launch support?",
      "How many revision rounds are included in the project scope?",
    ],
    summary: `This is a mock analysis for a ${
      readableExperienceLevel[experienceLevel] || "mid-level"
    } freelancer. The project appears moderately complex and would require a responsive frontend, backend logic and API integration. The estimate is displayed in ${currency}.`,
  };
}