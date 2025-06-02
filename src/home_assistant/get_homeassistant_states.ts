import {
  homeAssistantUrl,
} from "../config";
import { getHAAuthHeaders } from "./home_assistant_common";

export async function getHomeAssistantStates() {

  const headers = await getHAAuthHeaders();
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
