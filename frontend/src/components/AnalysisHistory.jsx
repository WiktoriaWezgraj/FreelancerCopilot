export default function AnalysisHistory({
  history,
  onSelectHistoryItem,
  onClearHistory,
}) {
  const hasHistory = history.length > 0;

  return (
    <section className="analysis-history">
      <div className="history-header">
        <div>
          <span className="history-eyebrow">Local history</span>
          <h2>Previous analyses</h2>
        </div>

        {hasHistory && (
          <button
            className="history-clear-button"
            type="button"
            onClick={onClearHistory}
          >
            Clear history
          </button>
        )}
      </div>

      {hasHistory ? (
        <div className="history-list">
          {history.map((item) => (
            <button
              key={item.id}
              className="history-item"
              type="button"
              onClick={() => onSelectHistoryItem(item)}
            >
              <div className="history-item-topline">
                <span
                  className={`history-decision decision-dot-${
                    item.result?.decision || "maybe"
                  }`}
                >
                  {(item.result?.decision || "maybe").toUpperCase()}
                </span>

                <span className="history-date">
                  {formatHistoryDate(item.createdAt)}
                </span>
              </div>

              <strong>{getBriefPreviewTitle(item.briefText)}</strong>

              <span className="history-preview">{item.briefText}</span>

              <div className="history-meta">
                <span>{item.experienceLevel}</span>
                <span>{item.currency}</span>
                <span>{item.result?.price || "No price"}</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="history-empty-state">
          <p className="history-empty-title">No analyses yet</p>
          <p className="history-empty-text">
            Your previous brief analyses will appear here once you run your
            first real analysis.
          </p>
        </div>
      )}
    </section>
  );
}

function formatHistoryDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleString([], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getBriefPreviewTitle(briefText) {
  if (!briefText) {
    return "Untitled analysis";
  }

  const firstSentence = briefText.split(".")[0];

  if (firstSentence.length <= 58) {
    return firstSentence;
  }

  return `${firstSentence.slice(0, 58)}...`;
}