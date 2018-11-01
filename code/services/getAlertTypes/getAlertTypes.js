/**
 * @typedef GetAlertTypesResp
 * @property {string} item_id
 * @property {string} name
 * @property {string} description
 * @property {string} icon
 */

/**
 * @param {number} [pageNum]For pagination
 * @param {number} [pageSize] For pagination
 * @returns {string} Error
 * @returns {GetAlertTypesResp[]}
 * 
 * Service for fetching alert types from AlertTypes collection
 */

function getAlertTypes(req, resp) {
  ClearBlade.init({request:req});

  var query = ClearBlade.Query();
  if (typeof req.params.pageNum =="undefined" ){
    req.params.pageNum=0;
  }
  if (typeof req.params.pageSize =="undefined" ){
    req.params.pageSize=0;
  }
  query.setPage(req.params.pageSize, req.params.pageNum);

  var col = ClearBlade.Collection({collectionName:"AlertTypes"});
  col.fetch(query, function (err, data) {
    if (err) {	
      resp.error(JSON.stringify(data));
    } else {
      resp.success(data);
    }
  });
}
