/**
 * @type Rule
 * @property {string} sensor_id
 * @property {string} value
 * @property {string} operator GT - greater than, LT - less than, EQ - equal
 * @property {string} property Sensor property to check ("sensor_reading")
 */

/**
 * @typedef GetAlertConfigResp
 * @property {string[]} contacts
 * @property {string} item_id
 * @property {boolean} disabled
 * @property {string} message
 * @property {string} name
 * @property {string} priority
 * @property {Rule[]} rules
 * @property {string} type_id
 */

/**
 * @param {string} [configuration_id] To query for specific configuration by item_id
 * @param {string} [type_id] To query for configurations of specific type
 * @param {number} [pageNum] For pagination
 * @param {number} [pageSize] For pagination
 * @returns {string} Error
 * @returns {GetAlertConfigResp[]}
 * 
 * Service for fetching alert configuration from AlertConfigurations collection
 */

function getAlertConfigurations(req, resp) {
  ClearBlade.init({request:req});
  
  var query = ClearBlade.Query();
  if (typeof req.params.pageNum =="undefined" ){
    req.params.pageNum=0;
  }
  if (typeof req.params.pageSize =="undefined" ){
    req.params.pageSize=0;
  }
  if (typeof req.params.alert_id !="undefined" && req.params.alert_id!="" ){
    query.equalTo("item_id", req.params.alert_id);
  }
  if (typeof req.params.type_id !="undefined" && req.params.type_id!="" ){
    query.equalTo("type_id", req.params.type_id);
  }
  query.setPage(req.params.pageSize, req.params.pageNum);

  var col = ClearBlade.Collection({collectionName:"AlertConfigurations"});
  col.fetch(query, function (err, data) {
    if (err) {	
      resp.error(JSON.stringify(data));
    } else {
      resp.success(data);
    }
  });
}
