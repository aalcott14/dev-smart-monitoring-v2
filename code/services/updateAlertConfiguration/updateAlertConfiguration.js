/**
 * @type Rule
 * @property {string} sensor_id
 * @property {string} value
 * @property {string} operator GT - greater than, LT - less than, EQ - equal
 * @property {string} property Sensor property to check ("sensor_reading")
 */

/**
 * @typedef UpdateAlertConfigReq
 * @property {boolean} [name]
 * @property {string} [type_id]
 * @property {Rule[]} [rules] Rules to indicated when alert has been violated
 * @property {string[]} [contacts] Employees to contact on violation
 * @property {string} [message]
 * @property {string} [priority] "High", "medium", or "low" to indicate which types of messages to send
 * @property {string[]} [disabled]
 * 
 */

 /**
 * @typedef UpdateAlertConfigResp
 * @property {number} count
 * 
 */

 /**
 * @param {UpdateAlertConfigReq} alertConfiguration
 * @param {string} item_id
 * @returns {string} Error
 * @returns {UpdateAlertConfigResp}
 * 
 * Service that updates an alert configuration in AlertConfigurations collection
 */

function updateAlertConfiguration(req, resp) {
  ClearBlade.init({ request: req });

  var query = ClearBlade.Query();
  query.equalTo('item_id', req.params.item_id);

  var col = ClearBlade.Collection({ collectionName: "AlertConfigurations" });
  col.update(query, req.params.alertConfiguration, function (err, data) {
    if (err) {
      resp.error(JSON.stringify(data));
    } else {
      resp.success(data);
    }
  });
}
