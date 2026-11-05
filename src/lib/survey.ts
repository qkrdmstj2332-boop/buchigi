// Demand survey: the answer is kept in localStorage (so the popup doesn't nag returning visitors)
// and also sent to a Google Sheet through a Google Apps Script web app (see google-apps-script/survey.gs).

export type SurveyAnswer = "yes" | "no";

/** Google Apps Script web app URL ("…/exec"). Leave empty to skip sending answers. */
export const SURVEY_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzGelcscwLlmCl2_GSYcn0pHjUVIq3KQE6uvlYAoakgBJxvj1LQlHCu8MqVJ1YRj2ER/exec";

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

function post(params: Record<string, string>) {
  if (!SURVEY_ENDPOINT) return;
  // Form-encoded + no-cors keeps this a "simple" request, which Apps Script accepts without a CORS preflight.
  // The response is opaque, so failures are silent; the visitor's own choice is already saved locally.
  fetch(SURVEY_ENDPOINT, {
    method: "POST",
    mode: "no-cors",
    body: new URLSearchParams({ ...params, visitor: visitorId() }),
  }).catch(() => {});
}

export function submitAnswer(answer: SurveyAnswer) {
  post({ answer });
}

// Follow-up questions asked after a "yes"; the sheet's 상세 응답 tab gets one row per completed set.
export const DETAIL_QUESTIONS = [
  { key: "age", question: "본인의 나이대를 알려주세요", options: ["10대", "20대", "30대", "40대", "50대", "60대 이상"] },
  { key: "parentAge", question: "부모님의 나이대를 알려주세요", options: ["40대 이하", "50대", "60대", "70대", "80대 이상"] },
  { key: "living", question: "부모님과 따로 살고 계신가요?", options: ["네, 독립했어요", "아니요, 함께 살아요"] },
] as const;

export type SurveyDetails = Record<(typeof DETAIL_QUESTIONS)[number]["key"], string>;

const DETAILS_KEY = "buchigi-survey-details-done";

export function getDetailsDone(): boolean {
  try {
    return localStorage.getItem(DETAILS_KEY) === "1";
  } catch {
    return false;
  }
}

export function submitDetails(details: SurveyDetails) {
  try {
    localStorage.setItem(DETAILS_KEY, "1");
  } catch {
    // ignore
  }
  post({ type: "detail", ...details });
}
