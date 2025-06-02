import {
  homeAssistantToken,
  homeAssistantUrl,
} from "../config";

export async function getHAAuthHeaders() {
  checkHomeAssistantCredentials();
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append(
    "Authorization",
    `Bearer ${homeAssistantToken}`
  );
  return headers;
}

/** throws an error, if home_assistant url or token is missing
 *
 */
function checkHomeAssistantCredentials() {
  if (!homeAssistantUrl)
    throw new Error("Please set HOME_ASSISTANT_URL");
  if (!homeAssistantToken)
    throw new Error("Please set HOME_ASSISTANT_TOKEN");
}
