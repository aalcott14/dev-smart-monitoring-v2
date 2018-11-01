const TOPIC_BASE = "sensor"
const sensorID = "111111"
const sensorValueBounds=[25,35]
/**
 * Generate sensor data for demo purposes. This will run on Edge only. To be run on a timer with no user permissions.
 * 
 * Publishes an MQTT message on TOPIC_BASE
 */
function generateSyntheticSensorData(req, resp) {
  if ( ! ClearBlade.isEdge()) {
    resp.success("Disabled on platform")
  }
  ClearBlade.init({request:req})
  var messaging = ClearBlade.Messaging()

  var topic = [TOPIC_BASE,sensorID].join('/')

  var range = sensorValueBounds[1] - sensorValueBounds[0]
  var lowerBound = sensorValueBounds[0]
  var randomSensorValue = new String(Math.floor(Math.random()*range + lowerBound));
  var signalStrength = new String(100)
  var messageDate = (new Date()).toISOString()
  var batteryLevel = "100"
  const systemKey =req.systemKey;
  var messageJSON = {
      edge_id: "first_edge",
      sensor_message:{
         batteryLevel,
         dataValue:randomSensorValue,
         sensorID,
         signalStrength,
         messageDate
      }
  }
  log({messageJSON})

  messaging.publish(topic,JSON.stringify(messageJSON))
  resp.success(messageJSON)

}
