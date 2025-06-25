import { homeAssistantUrl } from "../config";
import { SailerValue } from "../remoteportal/analyzeData";
import { getHAAuthHeaders } from "./home_assistant_common";

export async function setHomeAssistantState(
  sailerValue: SailerValue,
  {
    prefix,
    sensorKind,
  }: { prefix: string; sensorKind: string }
) {
  if (sailerValue.unit !== "°C")
    throw new Error(
      `Einheit ${sailerValue.unit} von ${sailerValue.title} wird noch nicht unterstützt.`
    );
  const haEntity:string = getHASensorEntityID(
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
        unique_id: `${haEntity}`
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

function encodeChars(decoded: string): string {
  const keyMap: { [key: string]: string } = {
    " ": "_",
    ß: "ss",
    ä: "ae",
    ö: "oe",
    ü: "ue",
    Ä: "ae",
    Ö: "oe",
    Ü: "ue",
    ".": "_",
    ":": "_",
  };
  const result: string[] = [];
  let underscore: boolean = false;
  for (const a of decoded) {
    const value = keyMap[a];
    // only one underscore in a row
    const encodedToken = value || a.toLowerCase();
    if (encodedToken == "_") {
      if (!underscore) {
        result.push("_");
        underscore = true;
      }
      // do not push an underscore, if already pushed
    } else {
      result.push(encodedToken);
      underscore = false;
    }
  }
  return result.join("");
}
