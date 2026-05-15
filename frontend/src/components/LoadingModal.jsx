export default function LoadingModal({ isOpen }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="loading-modal-backdrop" role="status" aria-live="polite">
      <div className="loading-modal">
        <div className="loader-spinner" />

        <div className="loading-modal-content">
          <p className="loading-modal-eyebrow">Analysis in progress</p>
          <h2>Freelancer Copilot is analyzing your brief...</h2>
          <p>
            Checking project scope, risks, timeline, pricing estimate and
            missing details to clarify with the client.
          </p>
        </div>
      </div>
    </div>
  );
}