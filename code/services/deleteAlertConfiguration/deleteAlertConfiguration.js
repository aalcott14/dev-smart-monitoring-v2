/**
 * @typedef DeleteAlertConfigResp
 * @property {number} count
 */

/**
 * @param {string} item_id
 * @returns {string} Error
 * @returns {DeleteAlertConfigResp[]}
 * 
 * Service for deleting an alert configuration from AlertConfigurations collection
 */

function deleteAlertConfiguration(req, resp) {
  ClearBlade.init({ request: req });

  var query = ClearBlade.Query();
  query.equalTo('item_id', req.params.item_id);
  
  var col = ClearBlade.Collection({ collectionName: "AlertConfigurations" });
  col.remove(query, function (err, data) {
    if (err) {
      resp.error(JSON.stringify(data));
    } else {
      response.success(data);
    }
  });
}
