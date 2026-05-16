export default function ErrorModal({ message, onClose }) {
  if (!message) {
    return null;
  }

  const errorDetails = getErrorDetails(message);

  return (
    <div className="error-modal-backdrop" role="alert" aria-live="assertive">
      <div className="error-modal">
        <div className="error-modal-icon">!</div>

        <div className="error-modal-content">
          <p className="error-modal-eyebrow">Analysis failed</p>
          <h2>{errorDetails.title}</h2>
          <p>{errorDetails.description}</p>

          <div className="error-modal-message">
            <span>Error details</span>
            <code>{message}</code>
          </div>

          <button className="error-modal-button" type="button" onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

function getErrorDetails(message) {
  const normalizedMessage = message.toLowerCase();

  if (
    normalizedMessage.includes("missing gemini_api_key") ||
    normalizedMessage.includes("api key not found")
  ) {
    return {
      title: "Missing API key",
      description:
        "The backend cannot find the Gemini API key. Add GEMINI_API_KEY to the backend .env file and restart the backend server.",
    };
  }

  if (
    normalizedMessage.includes("api key not valid") ||
    normalizedMessage.includes("invalid api key") ||
    normalizedMessage.includes("api_key_invalid")
  ) {
    return {
      title: "Invalid API key",
      description:
        "The Gemini API key is not valid. Check if the key was copied correctly, then restart the backend server.",
    };
  }

  return {
    title: "Something went wrong",
    description:
      "The analysis could not be completed. Check the backend terminal for more details and try again.",
  };
}