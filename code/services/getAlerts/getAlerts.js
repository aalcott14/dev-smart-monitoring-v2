/**
 * @type Rule
 * @property {string} sensor_id
 * @property {string} value
 * @property {string} operator GT - greater than, LT - less than, EQ - equal
 * @property {string} property Sensor property to check ("sensor_reading")
 */

/**
 * @typedef GetAlertsResp
 * @property {string[]} type_id
 * @property {string} is_active
 * @property {boolean} configuration_id
 * @property {string} sent_date
 * @property {string} acknowledge_date
 * @property {string} target_users
 */

/**
 * @param {string} [alert_id] To query for specific configuration by item_id
 * @param {string} [type_id] To query for configurations of specific type
 * @param {string} [configuration_id] To query for a specific configuration
 * @param {number} [pageNum] For pagination
 * @param {number} [pageSize] For pagination
 * @returns {string} Error
 * @returns {GetAlertsResp[]}
 * 
 * Service for fetching alerts from Alert collection with is_active status of true
 */

function getAlerts(req, resp) {
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
  if (typeof req.params.configuration_id !="undefined" && req.params.configuration_id!="" ){
    query.equalTo("configuration_id", req.params.configuration_id);
  }
  query.equalTo("is_active", true);
  query.setPage(req.params.pageSize, req.params.pageNum);

  var col = ClearBlade.Collection({collectionName:"Alerts"});
  col.fetch(query, function (err, data) {
    if (err) {	
      resp.error(JSON.stringify(data));
    } else {
      resp.success(data);
    }
    sendResponse();
  });
}
