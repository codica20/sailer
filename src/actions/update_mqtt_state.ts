import {
  CommandLineAction,
  CommandLineChoiceParameter,
  CommandLineFlagParameter,
  CommandLineParameterWithArgument,
  CommandLineStringParameter,
} from "@rushstack/ts-command-line";
import { interpretedValues } from "../remoteportal/analyzeData";
import { getDashboardSource } from "../remoteportal/getPageSource";
import {
  MqttOptions,
  publishMqttState,
} from "./../mqtt/publish_mqtt_state";
import { HeadlessOptionAction } from "./headless_option_action";

export type FilterOption = {
  filterPattern?: string;
};
export type HeadlessOption = {
  headlessBrowser: boolean;
};

export async function updateMqttState(
  params: MqttOptions & FilterOption & HeadlessOption
) {
  const { vControllerData, browser } =
    await getDashboardSource({
      headless: params.headlessBrowser,
    });
  try {
    const sailerValues = interpretedValues(
      vControllerData,
      params.filterPattern
    );
    await Promise.all(
      sailerValues.map((sailerValue) =>
        publishMqttState(sailerValue, params)
      )
    );
  } finally {
    await browser.close();
  }
}

export class UpdateMqttStateAction extends HeadlessOptionAction {
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

    this._stateTopicPathPrefix = this.defineStringParameter(
      {
        argumentName: "PATH_PREFIX",
        description:
          "MQTT-Pfad, der den Sailer-Entitäten beim MQTT-Topic vorangestellt wird",
        parameterLongName: "--state-topic-path-prefix",
        defaultValue: "sailer",
      }
    );
  }
  protected async onExecuteAsync(): Promise<void> {
    const filterPattern =
      this.getStringParameter("--filter").value;
    const entityPrefix = this.getStringParameter(
      "--ha-entity-prefix"
    ).value;
    const sailerDeviceName = this.getStringParameter(
      "--ha-sailer-device-name"
    ).value;
    const stateTopicPathPrefix = this.getStringParameter(
      "--state-topic-path-prefix"
    ).value;
    const headlessBrowser = this.getHeadlessBrowser();
    await updateMqttState({
      filterPattern,
      entityPrefix,
      sailerDeviceName,
      stateTopicPathPrefix,
      headlessBrowser,
    });
  }
}
