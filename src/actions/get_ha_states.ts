import {  getHomeAssistantStates } from "../home_assistant/get_homeassistant_states";

/** action for SailerCli
 * 
 */
export async function getHAStates(): Promise<void> {
  try {
    const result = await getHomeAssistantStates();
    console.log({ type: typeof result });
    console.log(result);
  } catch (e) {
    console.error(`Showing states failed: ${e}`);
    process.exit(1);
  }
}
