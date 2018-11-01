/**
 * @typedef UpdateAlertReq
 * @property {boolean} [is_active]
 * @property {string} [type_id]
 * @property {string} [configuration_id]
 * @property {string} [sent_date]
 * @property {string} [acknowledge_date]
 * @property {string[]} [target_users] Array of users to be contacted when alert is violated
 * 
 */

 /**
 * @typedef UpdateAlertResp
 * @property {number} count
 * 
 */

 /**
 * @param {UpdateAlertReq} alert
 * @param {string} item_id
 * @returns {string} Error
 * @returns {UpdateAlertResp}
 * Service that updates an alert in Alerts collection
 */

function updateAlert(req, resp) {
  ClearBlade.init({ request: req });

  var query = ClearBlade.Query();
  query.equalTo('item_id', req.params.item_id);

  var col = ClearBlade.Collection({ collectionName: "Alerts" });
  col.update(query, req.params.alert, function (err, data) {
    if (err) {
      resp.error(JSON.stringify(data));
    } else {
      resp.success(data);
    }
  });
}
