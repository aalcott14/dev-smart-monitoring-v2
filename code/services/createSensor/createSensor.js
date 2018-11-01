/**
 * @typedef Sensor
 * @property {string} name
 * @property {string} description
 * @property {string} sensor_label Readable label to display as name of sensor
 * @property {string} sensor_type_id Corresponds to item_id of a SensorType
 * @property {string} edge_id Corresponds to name of an Edge in Edges table
 */

/**
 * @typedef CreateSensorResponse
 * @property {string} active_key
 * @property {boolean} allow_certificate_auth
 * @property {boolean} allow_key_auth
 * @property {string} certificate
 * @property {string} description
 * @property {boolean} enabled
 * @property {string} keys
 * @property {string} name
 * @property {string} state
 * @property {string} type
 */

/**
 * @param {Sensor} sensor
 * @returns {string} Error
 * @returns {CreateSensorResponse[]}
 * 
 * Service for creating new sensors in the Devices table
 */

function createSensor(req, resp) {
  ClearBlade.init({ request: req });

  var sensor = ClearBlade.Device();
  
  if (req.params.sensor) {
    req.params.sensors = [req.params.sensor]
  }
  const createdList = []
  req.params.sensors.forEach(function (item) {
    item.active_key = req.systemSecret + "::" + item.name;
    item.allow_key_auth = true;
    item.allow_certificate_auth = false;
    item.enabled = false;
    item.type = "";
    item.state = "";
    sensor.create(item, function (err, data) {
      if (err) {
        resp.error(JSON.stringify(data));
      } else {
        createdList.push(data[0].item_id)
        if (createdList.length === req.params.sensors.length) {
          resp.success(createdList);
        }
      }
    });
  })
}
