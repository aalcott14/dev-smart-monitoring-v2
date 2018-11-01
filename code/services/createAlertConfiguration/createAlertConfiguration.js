/**
 * @type Rule
 * @property {string} sensor_id
 * @property {string} value
 * @property {string} operator GT - greater than, LT - less than, EQ - equal
 * @property {string} property Sensor property to check ("sensor_reading")
 */

/**
 * @typedef CreateAlertConfigurationReq
 * @property {string} name
 * @property {string} type_id
 * @property {Rule[]} rules
 * @property {string[]} contacts
 * @property {string} priority
 * @property {boolean} disabled
 * @property {string} message
 * 
 */

 /**
 * @typedef CreateAlertConfigurationResp
 * @property {string} item_id
 * 
 */

 /**
 * 
 * @param {CreateAlertConfigurationReq} alertConfiguration
 * @returns {string} Error
 * @returns {CreateAlertConfigurationResp[]} Array of new item ids
 * Service for creating new alert configurations in AlertConfigurations collection
 */

function createAlertConfiguration(req, resp) {
  ClearBlade.init({ request: req });

  var col = ClearBlade.Collection({ collectionName: "AlertConfigurations" });
  col.create(req.params.alertConfiguration, function (err, data) {
    if (err) {
      resp.error(JSON.stringify(data));
    } else {
      resp.success(data);
    }
  });
}
