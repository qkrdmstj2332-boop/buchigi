// Shared demo account for presenting the child app (welcometosuziland/buchigi-app).
// The server is a single-family prototype: DEMO_CODE must equal the server's DEVICE_TOKEN on Render.
// Everyone who opens the landing page sees this code, so the demo family must never hold real photos or voices.

export const APP_URL = "https://welcometosuziland.github.io/buchigi-app/app/";

/** Render server address, without a trailing slash. Empty until the server is deployed. */
export const DEMO_SERVER = "";

export const DEMO_CODE = "NODROP-JB97-Q6H6";

/** App link that pre-fills the server and code (read from the hash by the app, then removed from the URL). */
export function demoAppLink() {
  const hash = new URLSearchParams({ code: DEMO_CODE });
  if (DEMO_SERVER) hash.set("api", DEMO_SERVER);
  return `${APP_URL}#${hash}`;
}
