const ANALYSIS_HISTORY_KEY = "freelancer-copilot-analysis-history";
const MAX_HISTORY_ITEMS = 8;

export function getAnalysisHistory() {
  const storedHistory = localStorage.getItem(ANALYSIS_HISTORY_KEY);

  if (!storedHistory) {
    return [];
  }

  try {
    return JSON.parse(storedHistory);
  } catch (error) {
    console.error("Could not parse analysis history:", error);
    return [];
  }
}

export function saveAnalysisToHistory(analysisItem) {
  const currentHistory = getAnalysisHistory();

  const updatedHistory = [
    analysisItem,
    ...currentHistory.filter((item) => item.id !== analysisItem.id),
  ].slice(0, MAX_HISTORY_ITEMS);

  localStorage.setItem(ANALYSIS_HISTORY_KEY, JSON.stringify(updatedHistory));

  return updatedHistory;
}

export function clearAnalysisHistory() {
  localStorage.removeItem(ANALYSIS_HISTORY_KEY);
}