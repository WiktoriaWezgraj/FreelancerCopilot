export default function ResultCard({ result }) {
  const stackItems = Array.isArray(result.stack)
    ? result.stack
    : result.stack
    ? [result.stack]
    : [];

  const risks = Array.isArray(result.risks) ? result.risks : [];
  const missingDetails = Array.isArray(result.missingDetails)
    ? result.missingDetails
    : [];

  const hasDecision = result.decision || result.decisionLabel;
  const hasRiskArea = result.riskArea;

  const decision = result.decision || "maybe";

  const decisionMeta = {
    yes: {
      icon: "✓",
      status: "YES",
      badge: "Recommended",
      title: "Worth considering",
      text: "This project looks realistic and worth taking.",
    },
    maybe: {
      icon: "?",
      status: "MAYBE",
      badge: "Needs review",
      title: "Needs clarification",
      text: "This project needs clarification before accepting.",
    },
    no: {
      icon: "✕",
      status: "NO",
      badge: "High risk",
      title: "Too risky",
      text: "This project looks too risky or unsuitable right now.",
    },
  };

  const currentDecision = decisionMeta[decision] || decisionMeta.maybe;

  return (
    <section className="result-card">
      <h2>Analysis result</h2>

      <div className="result-content">
        {hasDecision && (
          <div className={`decision-box decision-${decision}`}>
            <span className="decision-icon">{currentDecision.icon}</span>

            <div className="decision-content">
              <div className="decision-topline">
                <span className="decision-status">
                  {currentDecision.status}
                </span>

                <span className="decision-badge">
                  {currentDecision.badge}
                </span>
              </div>

              <span className="result-label">
                Is it worth taking this project?
              </span>

              <p className="decision-title">
                {result.decisionLabel || currentDecision.title}
              </p>

              <p className="decision-text">{currentDecision.text}</p>
            </div>
          </div>
        )}

        <div className="result-grid">
          <div className="result-row">
            <span className="result-label">Price</span>
            <p className="result-value">{result.price || "No data"}</p>
          </div>

          <div className="result-row">
            <span className="result-label">Timeline</span>
            <p className="result-value">{result.timeline || "No data"}</p>
          </div>
        </div>

        <div className="result-row">
          <span className="result-label">Tech stack</span>

          {stackItems.length > 0 ? (
            <ul className="stack-list">
              {stackItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="result-value">No data</p>
          )}
        </div>

        {hasRiskArea && (
          <div className="result-row risk-row">
            <div className="risk-header">
              <span className="risk-icon">!</span>
              <span className="result-label">Main risk area</span>
            </div>

            <p className="result-value">{result.riskArea}</p>
          </div>
        )}

        {risks.length > 0 && (
          <div className="result-section">
            <div className="section-heading">
              <span className="section-eyebrow">Risk recognition</span>
              <h3>Potential project risks</h3>
            </div>

            <div className="risk-grid">
              {risks.map((risk, index) => (
                <article className="risk-card" key={index}>
                  <span className="risk-category">
                    {risk.category || "General risk"}
                  </span>
                  <p>{risk.description || "No description provided."}</p>
                </article>
              ))}
            </div>
          </div>
        )}

        {missingDetails.length > 0 && (
          <div className="result-section">
            <div className="section-heading">
              <span className="section-eyebrow">Missing details</span>
              <h3>Questions to clarify with the client</h3>
            </div>

            <ul className="missing-list">
              {missingDetails.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="result-row">
          <span className="result-label">Summary</span>
          <p className="result-value">
            {result.summary || "No summary available"}
          </p>
        </div>
      </div>
    </section>
  );
}