/**
 * @typedef UpdateLocationReq
 * @property {string} [name]
 * @property {string} [location_type]
 * @property {string} [icon]
 * @property {string} [description]
 * @property {string} [address]
 * @property {string} [lat]
 * @property {string} [long]
 * 
 */

 /**
 * @typedef UpdateLocationResp
 * @property {number} count
 * 
 */

 /**
 * @param {UpdateLocationReq} location
 * @param {string} location_id
 * @returns {string} Error
 * @returns {UpdateLocationResp}
 * Service that updates a location in Locations collection
 */

function updateLocation(req, resp) {
  ClearBlade.init({request:req});
  
  var query = ClearBlade.Query();
  query.equalTo('item_id', req.params.location_id);
  
  var col = ClearBlade.Collection({collectionName:"Locations"});
  col.update(query, req.params.location, function (err, data) {
    if (err) {
      resp.error(JSON.stringify(data));
    } else {
      resp.success(data);
    }
  });
}
