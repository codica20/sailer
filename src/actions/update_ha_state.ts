import { setHomeAssistantState } from "../home_assistant/set_homeassistant_state";
import { interpretedValues } from "../remoteportal/analyzeData";
import { getDashboardSource } from "../remoteportal/getPageSource";

export async function updateHAState(params: {
  filterPattern?: string;
  prefix?: string;
  sensorKind?: string;
}) {
  const { vControllerData, browser } =
    await getDashboardSource();
  try {
    const sailerValues = interpretedValues(
      vControllerData,
      params.filterPattern
    );
    if (sailerValues.length !== 1) {
      throw new Error(
        `Expected one SAILER param instead of ${sailerValues.length}. Please narrow with --filter!`
      );
    }
    if (!params.sensorKind)
      throw new Error(
        `Please, set sensor kind with --sensor-kind!`
      );
    await setHomeAssistantState(sailerValues[0], {
      prefix:
        typeof params.prefix !== "string"
          ? ""
          : params.prefix,
      sensorKind: params.sensorKind,
    });
  } finally {
    await browser.close();
  }
}
