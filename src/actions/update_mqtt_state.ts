import {
  CommandLineAction,
  CommandLineChoiceParameter,
  CommandLineParameterWithArgument,
  CommandLineStringParameter,
} from "@rushstack/ts-command-line";
import { interpretedValues } from "../remoteportal/analyzeData";
import { getDashboardSource } from "../remoteportal/getPageSource";
import { MqttOptions, publishMqttState } from "./../mqtt/publish_mqtt_state";

export type FilterOption= {
  filterPattern?: string
}

export async function updateMqttState(params: MqttOptions&FilterOption) {
  const { vControllerData, browser } =
    await getDashboardSource();
  try {
    const sailerValues = interpretedValues(
      vControllerData,
      params.filterPattern
    );
    if (sailerValues.length !== 1) {
      throw new Error(
        `Expected one single SAILER param instead of ${sailerValues.length}. Please narrow with --filter!`
      );
    }
    await publishMqttState(sailerValues[0], params);
  } finally {
    await browser.close();
  }
}

export class UpdateMqttStateAction extends CommandLineAction {
  public _filter: CommandLineParameterWithArgument;
  public _entityPrefix: CommandLineStringParameter;
  public _sailerDeviceName: CommandLineStringParameter;
  public _stateTopicPathPrefix: CommandLineStringParameter;

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
    this._entityPrefix = this.defineStringParameter({
      argumentName: "PREFIX",
      description:
        "Präfix, das vor den SAILER-Namen des Werts für die Benennung der HomeAssistant-UniqueID gestellt wird.",
      parameterLongName: "--ha-entity-prefix",
      defaultValue: "sailer_",
    });

    this._sailerDeviceName = this.defineStringParameter({
      argumentName: "NAME",
      description:
        "Name, unter dem das Sailer-Gerät im HomeAssistant dargestellt werden soll.",
      parameterLongName: "--ha-sailer-device-name",
      defaultValue: "SAILER",
    });
    
    this._stateTopicPathPrefix = this.defineStringParameter({
      argumentName: "PATH_PREFIX",
      description:
        "MQTT-Pfad, der den Sailer-Entitäten beim MQTT-Topic vorangestellt wird",
      parameterLongName: "--state-topic-path-prefix",
      defaultValue: "sailer",
    });
  }
  protected async onExecuteAsync(): Promise<void> {
    const filterPattern =
      this.getStringParameter("--filter").value;
    const entityPrefix =
      this.getStringParameter("--ha-entity-prefix").value;
    const sailerDeviceName =
      this.getStringParameter("--ha-sailer-device-name").value;
    const stateTopicPathPrefix =
      this.getStringParameter("--state-topic-path-prefix").value;
    await updateMqttState({
      filterPattern,
      entityPrefix,
      sailerDeviceName,
      stateTopicPathPrefix

    });
  }
}
