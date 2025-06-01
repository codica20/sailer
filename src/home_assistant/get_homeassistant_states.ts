import {
  homeAssistantToken,
  homeAssistantUrl,
} from "../config";

export async function getHomeAssistantStates() {
  console.log("Getting ha states ...");
  checkHomeAssistantCredentials();
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append(
    "Authorization",
    `Bearer ${homeAssistantToken}`
  );
  const response = await fetch(
    homeAssistantUrl + "/api/states",
    { headers }
  );
  if (response.status !== 200) {
    console.log({ headers, response });
    throw new Error(`Fetching states failed: ${
      response.statusText
    } (${response.status})
      ${await response.text()}`);
  }
  const parsed = await response.json();
  return parsed;
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
