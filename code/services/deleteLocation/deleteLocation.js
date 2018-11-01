/**
 * @typedef DeleteLocationResp
 * @property {number} count
 */

/**
 * @param {string} location_id
 * @returns {string} Error
 * @returns {DeleteLocationResp[]}
 * 
 * Service for deleting a location from Locations collection
 */

function deleteLocation(req, resp) {
  ClearBlade.init({request:req});
  
  var query = ClearBlade.Query();
  query.equalTo('item_id', req.params.location_id);

  var col = ClearBlade.Collection({collectionName:"Locations"});
  col.remove(query, function (err, data) {
    if (err) {
      resp.error(JSON.stringify(data));
    } else {
      response.success(data);
    }
  });
}
