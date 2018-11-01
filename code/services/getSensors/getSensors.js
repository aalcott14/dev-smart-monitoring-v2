/**
 * @typedef GetSensorsResp
 * @property {boolean} allow_certificate_auth
 * @property {boolean} allow_key_auth
 * @property {number} battery_level
 * @property {string} certificate
 * @property {number} created_date Epoch format
 * @property {string} description
 * @property {string} device_key
 * @property {string} edge_id
 * @property {boolean} enabled
 * @property {boolean} has_keys
 * @property {number} last_active_date Epoch format
 * @property {string} name
 * @property {string} reading_time ISO 8601 format
 * @property {string} sensor_label
 * @property {string} sensor_reading
 * @property {string} sensor_type_id
 * @property {number} signal_strength
 * @property {string} state
 * @property {string} system_key
 * @property {string} type
 */

/**
 * @param {string} [sensor_id] To query for sensors by name
 * @param {string} [sensor_type_id] To query for sensors by item_id of type
 * @param {string} [edge_id] To query for sensors by edge_key of edge
 * @param {number} [pageNum] For pagination
 * @param {number} [pageSize] For pagination
 * @returns {string} Error
 * @returns {GetSensorsResp[]}
 * 
 * Service for fetching sensors from Devices table
 */

function getSensors(req, resp) {
  ClearBlade.init({request:req});
  
  var query = ClearBlade.Query();
  if (typeof req.params.pageNum =="undefined" ){
    req.params.pageNum=0;
  }
  if (typeof req.params.pageSize =="undefined" ){
    req.params.pageSize=0;
  }
  if (typeof req.params.name !="undefined" && req.params.name!="" ){
    query.equalTo("name", req.params.sensor_id);
  }
  if (typeof req.params.sensor_type_id !="undefined" && req.params.sensor_type_id!="" ){
    query.equalTo("sensor_type_id", req.params.sensor_type_id);
  }
  if (typeof req.params.edge_id !="undefined" && req.params.edge_id!="" ){
    query.equalTo("edge_id", req.params.edge_id);
  }
  query.setPage(req.params.pageSize, req.params.pageNum);
  
  var sensor = ClearBlade.Device();
  sensor.fetch(query, function (err, data) {
    if (err) {	
      resp.error(JSON.stringify(data));
    } else {
      resp.success(data);
    }
  });
}
