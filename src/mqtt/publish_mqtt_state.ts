import { connectAsync } from "mqtt";
import { mqttServerHost } from "../config";
import { SailerValue } from "../remoteportal/analyzeData";

export type MqttOptions = {
  prefix: string;
  sensorKind: string;
};
export async function publishMqttState(
  sailerValue: SailerValue,
  options: MqttOptions
): Promise<void> {
  console.log({ sailerValue, options });
  const mqttTopic: string = getMqttTopic(
    sailerValue,
    options
  );
  const mqttMessage: string = getMqttMessage(
    sailerValue,
    options
  );
  const mqttHost: string = getMqttHost(options);

  await publishMqttMessage(
    mqttHost,
    mqttTopic,
    mqttMessage
  );
  //TODO: mqtt Discovery
}

function getMqttTopic(
  sailerValue: SailerValue,
  options: MqttOptions
) {
  return "hello/world";
}
function getMqttMessage(
  sailerValue: SailerValue,
  options: MqttOptions
) {
  return "(" + sailerValue.value + ")";
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

/** low level function to publish to MQTT Host */
async function publishMqttMessage(
  mqttHost: string,
  mqttTopic: string,
  mqttMessage: string
): Promise<void> {
  const client = await connectAsync(mqttHost);
  const packet = await client.publishAsync(
    mqttTopic,
    mqttMessage
  );
  console.log({ packet });
  await client.endAsync();
}
