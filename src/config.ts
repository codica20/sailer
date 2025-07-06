import "dotenv/config";

if(!process.env.SAILER_PASSWORD)
  throw new Error("Please set environment variable SAILER_PASSWORD!")
export const sailerPassword=process.env.SAILER_PASSWORD;
if(!process.env.SAILER_USER)
  throw new Error("Please set environment variable SAILER_USER!")
export const sailerUser=process.env.SAILER_USER;

export const homeAssistantUrl=process.env.HOME_ASSISTANT_URL;
export const homeAssistantToken=process.env.HOME_ASSISTANT_TOKEN;


export const mqttServerHost=process.env.MQTT_SERVER_HOST;

export const mqttHaDiscoveryPrefix=process.env.MQTT_HA_DISCOVERY_PREFIX;