import {
  CommandLineAction,
  CommandLineChoiceParameter,
  CommandLineParameterWithArgument,
  CommandLineStringParameter,
} from "@rushstack/ts-command-line";
import { interpretedValues } from "../remoteportal/analyzeData";
import { getDashboardSource } from "../remoteportal/getPageSource";
import { publishMqttState } from "./../mqtt/publish_mqtt_state";

export async function updateMqttState(params: {
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
    await publishMqttState(sailerValues[0], {
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

export class UpdateMqttStateAction extends CommandLineAction {
  public _filter: CommandLineParameterWithArgument;
  public _haSensorKind: CommandLineChoiceParameter;
  public _prefix: CommandLineStringParameter;

  public constructor() {
    super({
      actionName: "update-mqtt-state",
      documentation:
        "Publish MQTT state with SAILER value. Nur ein State kann aktualisiert werden.",
      summary: "Publish MQTT state with SAILER value",
    });
    this._filter = this.defineStringParameter({
      parameterLongName: "--filter",
      description:
        "Es werden die SAILER-Parameter ausgewählt, deren Bezeichnung mit dem angegebenen Muster übereinstimmen.",
      argumentName: "MUSTER",
    });
    this._haSensorKind = this.defineChoiceParameter({
      defaultValue: "sensor",
      alternatives: ["sensor", "binary_sensor"],
      description:
        "Typ des HomeAssistant sensor for MQTT discovery",
      parameterLongName: "--sensor-kind",
    });
    this._prefix = this.defineStringParameter({
      argumentName: "PREFIX",
      description:
        "Präfix, das zwischen dem Sensortyp (z.B. 'sensor.') und dem SAILER-Namen für die Benennung der HomeAssistant-UniqueID gestellt wird.",
      parameterLongName: "--mqtt-prefix",
      defaultValue: "sailer_",
    });
  }
  protected async onExecuteAsync(): Promise<void> {
    const sensorKind =
      this.getChoiceParameter("--sensor-kind").value;
    const filterPattern =
      this.getStringParameter("--filter").value;
    const prefix =
      this.getStringParameter("--mqtt-prefix").value;
    await updateMqttState({
      filterPattern,
      prefix,
      sensorKind: sensorKind,
    });
  }
}
