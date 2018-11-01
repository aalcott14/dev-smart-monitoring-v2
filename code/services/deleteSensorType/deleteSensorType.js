/**
 * @typedef DeleteSensorTypeResp
 * @property {number} count
 */

/**
 * @param {string} sensor_type_id
 * @returns {string} Error
 * @returns {DeleteLocationResp[]}
 * 
 * Service for deleting a sensor type from SensorTypes collection
 */

function deleteSensorType(req, resp) {
  ClearBlade.init({request:req});
  
  var query = ClearBlade.Query();
  query.equalTo('item_id', req.params.sensor_type_id);
  
  var col = ClearBlade.Collection({collectionName:"SensorTypes"});
  col.remove(query, function (err, data) {
    if (err) {
      resp.error(JSON.stringify(data));
    } else {
      resp.success(data);
    }
  });
}
