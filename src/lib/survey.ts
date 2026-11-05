// Demand survey: the answer is kept in localStorage (so the popup doesn't nag returning visitors)
// and also sent to a Google Sheet through a Google Apps Script web app (see google-apps-script/survey.gs).

export type SurveyAnswer = "yes" | "no";

/** Google Apps Script web app URL ("…/exec"). Leave empty to skip sending answers. */
export const SURVEY_ENDPOINT = "";

const ANSWER_KEY = "buchigi-survey-answer";
const VISITOR_KEY = "buchigi-visitor-id";

export function getSavedAnswer(): SurveyAnswer | null {
  try {
    const v = localStorage.getItem(ANSWER_KEY);
    return v === "yes" || v === "no" ? v : null;
  } catch {
    return null;
  }
}

export function saveAnswer(answer: SurveyAnswer) {
  try {
    localStorage.setItem(ANSWER_KEY, answer);
  } catch {
    // Private mode or blocked storage: the answer is still sent below.
  }
}

// Anonymous per-browser id so repeat answers from one visitor can be told apart in the sheet.
function visitorId() {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return "unknown";
  }
}

export function submitAnswer(answer: SurveyAnswer) {
  if (!SURVEY_ENDPOINT) return;
  // Form-encoded + no-cors keeps this a "simple" request, which Apps Script accepts without a CORS preflight.
  // The response is opaque, so failures are silent; the visitor's own choice is already saved locally.
  fetch(SURVEY_ENDPOINT, {
    method: "POST",
    mode: "no-cors",
    body: new URLSearchParams({ answer, visitor: visitorId() }),
  }).catch(() => {});
}
