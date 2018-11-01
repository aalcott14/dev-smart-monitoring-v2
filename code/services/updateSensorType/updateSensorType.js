/**
 * @typedef UpdateSensorTypeReq
 * @param {string} [name]
 * @param {string} [description]
 * @param {string} [data_type] Data type of sensor's data value
 * @param {string} [attributes] Special character corresponding to data value provided
 * @param {string} [icon]
 * @param {boolean} [isProbe] Whether or not sensor is a probe
 * 
 */

 /**
 * @typedef UpdateSensorTypeResp
 * @property {number} count
 * 
 */

 /**
 * @param {UpdateSensorTypeReq} sensor_type
 * @param {string} sensor_type_id
 * @returns {string} Error
 * @returns {UpdateSensorTypeResp}
 * Service that updates a sensor type in SensorTypes collection
 */

function updateSensorType(req, resp) {
  ClearBlade.init({request:req});
  
  var query = ClearBlade.Query();
  query.equalTo('item_id', req.params.sensor_type_id);
  
  var col = ClearBlade.Collection({collectionName:"SensorTypes"});
  col.update(query, req.params.sensor_type, function (err, data) {
    if (err) {
      resp.error(JSON.stringify(data));
    } else {
      resp.success(data);
    }
  });
}
