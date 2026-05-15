export default function BriefForm({
  briefText,
  setBriefText,
  experienceLevel,
  setExperienceLevel,
  currency,
  setCurrency,
  loading,
  onAnalyze,
  onMockResult,
  onClear,
}) {
  return (
    <section className="brief-form">
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="experienceLevel">Experience level</label>
          <select
            id="experienceLevel"
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
          >
            <option value="junior">Junior</option>
            <option value="mid">Mid-level</option>
            <option value="senior">Senior</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="currency">Currency</label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="PLN">PLN</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </div>

      <div className="textarea-wrapper">
        <label className="textarea-label" htmlFor="briefText">
          Client brief
        </label>
        <textarea
          id="briefText"
          className="brief-textarea"
          rows={10}
          placeholder="Paste the client brief here..."
          value={briefText}
          onChange={(e) => setBriefText(e.target.value)}
        />

      </div>

      <div className="form-actions">
        <button
          className="button button-primary"
          onClick={onAnalyze}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze brief"}
        </button>

        <button
          className="button button-secondary"
          type="button"
          onClick={onMockResult}
        >
          Show mock result
        </button>

        <button className="button button-light" type="button" onClick={onClear}>
          Clear result
        </button>
      </div>
    </section>
  );
}