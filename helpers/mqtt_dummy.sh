#!/bin/bash
# This script sends a message to the MQTT broker

set -e
set -x 

source $(dirname "$0")/../.env
echo Veröffentliche auf $MQTT_SERVER_HOST
mosquitto_pub -h $MQTT_SERVER_HOST -t bach/untergeschoss/sailer/tempSpeicherUnten -m "30"

# entity discovery (legacy)
mosquitto_pub -h $MQTT_SERVER_HOST -t eisnergut/homeassistant/mqtt_discovery/sensor/mqttBachSailerSpeicherUnten/config \
  -m '{    "device_class":"temperature",    "state_topic":"bach/untergeschoss/sailer/tempSpeicherUnten",    "unit_of_measurement":"°C",    "unique_id":"mqttBachHeizraumSailerTempSpeicherUnten",    "device":{"identifiers":["bachHeizraum"],       "name":"BachHeizraum",       "manufacturer": "Example sensors Ltd.",       "model": "Example Sensor",       "model_id": "F1"    } }'

# device discovery
mosquitto_pub -h $MQTT_SERVER_HOST -t eisnergut/homeassistant/mqtt_discovery/device/mqttBachSailer/config \
  -m '{ "dev": { "ids": "sailerMaster", "name": "SAILER Remoteportal", "mf": "SAILER Ehingen" }, "o" : {"name":"sailer_cli"}, "cmps": { "bach_kollektor_temp": { "p":"sensor", "device_class":"temperature",    "state_topic":"bach/untergeschoss/sailer/tempKollektor",    "unit_of_measurement":"°C",    "unique_id":"mqttBachHeizraumSailerTempKollektor"  } } }'


mosquitto_pub -h $MQTT_SERVER_HOST -t bach/untergeschoss/sailer/tempKollektor -m "10"
