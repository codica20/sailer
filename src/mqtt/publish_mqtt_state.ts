import { connectAsync } from "mqtt";
import {
  mqttHaDiscoveryPrefix,
  mqttServerHost,
} from "../config";
import { SailerValue } from "../remoteportal/analyzeData";
import { encodeChars } from "../utils/encodeChars";
import { jsoning } from "../utils/jsoning";

export type MqttOptions = {
  /** See getMqttEntityName */
  entityPrefix?: string;

  /** the mqtt state topic path prefix, i.e. everything before the name of the entity.
   *  Default: "sailer"
   */
  stateTopicPathPrefix?: string;

  /** Sailer Device Name (as displayed in Home Assistant).
   * Default: "SAILER"
   */
  sailerDeviceName?: string;
};
export async function publishMqttState(
  sailerValue: SailerValue,
  options: MqttOptions
): Promise<void> {
  console.log({ sailerValue, options });

  const mqttHost: string = getMqttHost(options);

  //------------ publish mqtt discovery ----------------
  const mqttDiscoveryTopic = getMqttDiscoveryTopic(
    sailerValue,
    options
  );
  const mqttDiscoveryMessage = getMqttDiscoveryMessage(
    sailerValue,
    options
  );

  await publishMqttMessage(
    mqttHost,
    mqttDiscoveryTopic,
    mqttDiscoveryMessage
  );

  // ---------- publish Mqtt State --------------
  const mqttTopic: string = getMqttStateTopic(
    sailerValue,
    options
  );
  const mqttMessage: string = getMqttMessage(
    sailerValue,
    options
  );
  await publishMqttMessage(
    mqttHost,
    mqttTopic,
    mqttMessage
  );
  //TODO: mqtt Discovery
}

function getMqttStateTopic(
  sailerValue: SailerValue,
  options: MqttOptions
) {
  return (
    (options.stateTopicPathPrefix || "sailer") +
    "/" +
    getMqttEntityName(sailerValue, options)
  );
}
function getMqttMessage(
  sailerValue: SailerValue,
  options: MqttOptions
) {
  return sailerValue.value.toFixed(1);
}

/**
 * returns the MQTT host name or ip including the protocoll.
 * It returns MQTT_SERVER_HOST environment variable or localhost
 * @param options
 * @returns
 */
function getMqttHost(options: MqttOptions) {
  return "mqtt://" + (mqttServerHost || "localhost");
}

function getMqttDiscoveryTopic(
  sailerValue: SailerValue,
  options: MqttOptions
): string {
  if (sailerValue.unit !== "°C")
    throw new Error(
      `Einheit ${sailerValue.unit} of ${sailerValue.title} wird noch nicht unterstützt.`
    );
  return (
    getMqttDiscoveryPrefix() +
    "/sensor/" +
    getMqttEntityName(sailerValue, options) +
    "/config"
  );
}

/** returns prefix plus encoded sailerValue.title. It is used in Mqtt Discovery Topic and Mqtt State Topic  */
function getMqttEntityName(
  sailerValue: SailerValue,
  options: Pick<MqttOptions, "entityPrefix">
) {
  return `${options.entityPrefix}${encodeChars(
    sailerValue.title
  )}`;
}

type MqttEntityDiscoveryMessage = {
  /** Name of the entity
   *
   */
  name: string;

  /** Todo: should implement other device classes
   *
   */
  device_class: "temperature";

  state_topic: string;

  /** Todo: should implement other units
   *
   */
  unit_of_measurement: "°C";

  unique_id: string;

  device: {
    identifiers: string[];
    name: string;
    manufacturer?: string;
    model?: string;
    model_id?: string;
  };
  origin: { name: "sailer_cli" };
};

function getMqttDiscoveryMessage(
  sailerValue: SailerValue,
  options: MqttOptions
): string {
  if (sailerValue.unit !== "°C")
    throw new Error(
      `Einheit ${sailerValue.unit} of ${sailerValue.title} wird noch nicht unterstützt.`
    );
  const msg: MqttEntityDiscoveryMessage = {
    name: sailerValue.title,
    unique_id: getMqttEntityName(sailerValue, options),
    device_class: "temperature",
    state_topic: getMqttStateTopic(sailerValue, options),
    unit_of_measurement: sailerValue.unit,
    device: {
      identifiers: [getSailerDeviceName(options)],
      name: getSailerDeviceName(options),
      manufacturer: "Sailer Ehingen",
    },
    origin: { name: "sailer_cli" },
  };

  return jsoning(msg);
}

/** returns options.sailerDeviceName or "SAILER" */
function getSailerDeviceName({
  sailerDeviceName,
}: Pick<MqttOptions, "sailerDeviceName">): string {
  return sailerDeviceName || "SAILER";
}

/** returns the homeassistant mqtt discovery prefix
 *
 * @see https://www.home-assistant.io/integrations/mqtt/#mqtt-discovery
 */
function getMqttDiscoveryPrefix() {
  return mqttHaDiscoveryPrefix || "homeassistant";
}

/** low level function to publish to MQTT Host */
async function publishMqttMessage(
  mqttHost: string,
  mqttTopic: string,
  mqttMessage: string
): Promise<void> {
  const client = await connectAsync(mqttHost);
  await client.publishAsync(mqttTopic, mqttMessage);
  console.log({ mqttHost, mqttTopic, mqttMessage });
  await client.endAsync();
}
