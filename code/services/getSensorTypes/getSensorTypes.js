/**
 * @typedef GetSensorTypesResp
 * @property {string} item_id
 * @property {string} name
 * @property {string} description
 * @property {string} icon
 */

/**
 * @param {string} [sensor_type_id] To query for sensor types by item_id
 * @param {number} [pageNum] For pagination
 * @param {number} [pageSize] For pagination
 * @returns {string} Error
 * @returns {GetSensorTypesResp[]}
 * 
 * Service for fetching sensor types from SensorTypes collection
 */

function getSensorTypes(req, resp) {
  ClearBlade.init({request:req});
  
  var query = ClearBlade.Query();
  if (typeof req.params.pageNum =="undefined" ){
    req.params.pageNum=0;
  }
  if (typeof req.params.pageSize =="undefined" ){
    req.params.pageSize=0;
  }
  if (typeof req.params.sensor_type_id !="undefined" && req.params.sensor_type_id!="" ){
    query.equalTo("item_id", req.params.sensor_type_id);
  }
  query.setPage(req.params.pageSize, req.params.pageNum);
  
  var col = ClearBlade.Collection({collectionName:"SensorTypes"});
  col.fetch(query, function (err, data) {
    if (err) {	
      resp.error(JSON.stringify(data));
    } else {
      resp.success(data);
    }
  });
}
