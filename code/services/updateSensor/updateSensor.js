/**
 * @typedef UpdateSensorReq
 * @property {boolean} [enabled]
 * @property {string} [description]
 * @property {string} [edge_id] Name of sensor's edge
 * @property {string} [sensor_reading] Most recent reading from sensor
 * @property {number} [battery_level]
 * @property {number} [signal_strength]
 * @property {string} [reading_time] ISO 8601 format
 * @property {string} [sensor_type_id] Id of sensor type from SensorTypes collection
 * @property {string} [sensor_label] Readable label of sensor to be displayed in portal
 * 
 */

 /**
 * @typedef UpdateSensorResp
 * @property {boolean} allow_certificate_auth
 * @property {boolean} allow_key_auth
 * @property {number} created_date Epoch format
 * @property {string} device_key
 * @property {string} edge_id
 * @property {boolean} enabled
 * @property {number} last_active_date Epoch format
 * @property {string} name
 * @property {string} reading_time ISO 8601 format
 * @property {string} sensor_label
 * @property {string} sensor_type_id
 * @property {string} state
 * @property {string} system_key
 * @property {string} type
 * 
 */

 /**
 * @param {UpdateSensorReq} sensor
 * @param {string} sensor_id
 * @returns {string} Error
 * @returns {UpdateSensorResp}
 * Service that updates a sensor in Devices table
 */

function updateSensor(req, resp) {
  ClearBlade.init({request:req});

  var query = ClearBlade.Query();
  if (typeof req.params.sensor_id !="undefined" && req.params.sensore_id!="" ){
    query.equalTo("name", req.params.sensor_id);
  }
  
  var sensor = ClearBlade.Device();
  sensor.update(query, req.params.sensor, function (err, data) {
    if (err) {
      resp.err(JSON.stringify(data));
    } else {
      resp.success(data);
    }
  });
}
