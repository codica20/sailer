#!/bin/bash
# This script sends a message to the MQTT broker

set -e
set -x 

source $(dirname "$0")/../.env
echo Veröffentliche auf $MQTT_SERVER_HOST
mosquitto_pub -h $MQTT_SERVER_HOST -t bach/untergeschoss/sailer/tempSpeicherUnten -m "41"

mosquitto_pub -h $MQTT_SERVER_HOST -t eisnergut/homeassistant/mqtt_discovery/sensor/mqttBachSailerSpeicherUnten/config \
  -m '{    "device_class":"temperature",    "state_topic":"bach/untergeschoss/sailer/tempSpeicherUnten",    "unit_of_measurement":"°C",    "unique_id":"mqttBachHeizraumSailerTempSpeicherUnten",    "device":{"identifiers":["bachHeizraum"],       "name":"BachHeizraum",       "manufacturer": "Example sensors Ltd.",       "model": "Example Sensor",       "model_id": "F1"    } }'