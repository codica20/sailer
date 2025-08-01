import { homeAssistantUrl } from "../config";
import { SailerValue } from "../remoteportal/analyzeData";
import { encodeChars } from "../utils/encodeChars";
import { jsoning } from "../utils/jsoning";
import { getHAAuthHeaders } from "./home_assistant_common";

export async function setHomeAssistantState(
  sailerValue: SailerValue,
  {
    prefix,
    sensorKind,
  }: { prefix: string; sensorKind: string }
) {
  if (sailerValue.type !== "variable")
    throw new Error(
      `Typ ${sailerValue.type} in ${jsoning(
        sailerValue
      )} wird noch nicht unterstützt.`
    );
  if (sailerValue.unit !== "°C")
    throw new Error(
      `Einheit ${sailerValue.unit} von ${sailerValue.title} wird noch nicht unterstützt.`
    );
  const haEntity: string = getHASensorEntityID(
    sensorKind,
    prefix,
    sailerValue.title
  );
  const headers = await getHAAuthHeaders();
  const body = JSON.stringify(
    {
      // round to one digit
      // See https://stackoverflow.com/questions/9339870/how-to-reduce-numbers-significance-in-jsons-stringify
      state: Number(sailerValue.value.toFixed(1)),
      attributes: {
        state_class: "measurement",
        device_class: "temperature",
        unit_of_measurement: sailerValue.unit,
        unique_id: `${haEntity}`,
      },
    },
    undefined,
    "  "
  );
  console.log("------Body ------");
  console.log(body);
  console.log("^^^^^^Body^^^^^^^");
  const entityUrl =
    homeAssistantUrl + "/api/states/" + haEntity;
  const response = await fetch(entityUrl, {
    method: "POST",
    headers,
    body,
  });
  if (response.status !== 200 && response.status !== 201) {
    console.error({ entityUrl, headers, body, response });
    throw new Error(`Posting new state ${haEntity} failed: ${
      response.statusText
    } (${response.status}).
      ${await response.text()}`);
  }
  return await response.json();
}

function getHASensorEntityID(
  sensorKind: string,
  prefix: string,
  sKey: string
): string {
  const sensorKey = `${sensorKind}.${encodeChars(
    prefix
  )}${encodeChars(sKey)}`;
  return sensorKey;
}
