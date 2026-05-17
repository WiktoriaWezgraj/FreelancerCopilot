import { useState } from "react";

export default function ProposalDraftCard({ proposal, loading, onGenerate }) {
  const [copied, setCopied] = useState(false);
  const proposalParagraphs = getProposalParagraphs(proposal?.proposalDraft);

  async function handleCopyProposal() {
    if (!proposal?.proposalDraft) return;

    try {
      await navigator.clipboard.writeText(proposal.proposalDraft);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (err) {
      console.error("Could not copy proposal draft:", err);
    }
  }

  return (
    <section className="proposal-card">
      <div className="proposal-header">
        <div>
          <span className="proposal-eyebrow">Client response</span>
          <h2>Proposal draft</h2>
        </div>

        <button
          className="proposal-generate-button"
          type="button"
          onClick={onGenerate}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate proposal draft"}
        </button>
      </div>

      <p className="proposal-intro">
        Generate a client-facing message based on the current brief analysis.
        The draft will include scope understanding, preliminary estimate, next
        steps and clarification questions.
      </p>

      {loading && (
        <div className="proposal-loader">
          <div className="proposal-loader-topline">
            <span>Generating proposal draft...</span>
            <span>Please wait</span>
          </div>

          <div className="proposal-progress">
            <span />
          </div>
        </div>
      )}

      {proposal && !loading && (
        <div className="proposal-result">
          <div className="proposal-subject">
            <span>Subject line</span>
            <p>{proposal.subjectLine || "Project proposal"}</p>
          </div>

          <div className="proposal-text">
            <div className="proposal-text-header">
              <span>Draft message</span>

              <button
                className={`proposal-copy-button ${copied ? "copied" : ""}`}
                type="button"
                onClick={handleCopyProposal}
                disabled={!proposal.proposalDraft}
                aria-label="Copy proposal draft"
              >
                <CopyIcon />
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="proposal-message">
              {proposalParagraphs.length > 0 ? (
                proposalParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              ) : (
                <p>No proposal draft was generated. Please try again.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function getProposalParagraphs(proposalDraft) {
  if (!proposalDraft || typeof proposalDraft !== "string") {
    return [];
  }

  return proposalDraft
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function CopyIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
    >
      <path
        d="M8 8.5C8 7.12 9.12 6 10.5 6H17.5C18.88 6 20 7.12 20 8.5V17.5C20 18.88 18.88 20 17.5 20H10.5C9.12 20 8 18.88 8 17.5V8.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M5 15.5H4.5C3.12 15.5 2 14.38 2 13V5.5C2 4.12 3.12 3 4.5 3H12C13.38 3 14.5 4.12 14.5 5.5V6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}