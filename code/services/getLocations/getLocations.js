/**
 * @typedef GetLocationsResp
 * @property {string} location_type
 * @property {string} icon
 * @property {string} name
 * @property {string} description
 * @property {string} lat
 * @property {string} long
 * @property {string} address
 */

/**
 * @param {string} [location_id]
 * @param {number} [pageNum] For pagination
 * @param {number} [pageSize] For pagination
 * @returns {string} Error
 * @returns {GetLocationsResp[]}
 * 
 * Service for fetching locations from Locations collection
 */

function getLocations(req, resp) {
  ClearBlade.init({request:req});

  var query = ClearBlade.Query();
  if (typeof req.params.pageNum =="undefined" ){
    req.params.pageNum=0;
  }
  if (typeof req.params.pageSize =="undefined" ){
    req.params.pageSize=0;
  }
  if (typeof req.params.location_id !="undefined" && req.params.location_id!="" ){
    query.equalTo("item_id", req.params.location_id);
  }
  query.setPage(req.params.pageSize, req.params.pageNum);

  var col = ClearBlade.Collection({collectionName:"Locations"});
  col.fetch(query, function (err, data) {
    if (err) {	
      resp.error(JSON.stringify(data));
    } else {
      resp.success(data);
    }
  });
}
