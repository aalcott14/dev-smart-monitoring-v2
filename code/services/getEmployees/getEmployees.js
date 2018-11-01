/**
 * @typedef GetEmployeesResp
 * @property {string} email
 * @property {string} creation_date
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} phone_number
 * @property {string[]} locations
 * @property {string} photo
 * @property {string} pin
 */

/**
 * @param {string} [employee_id]
 * @param {string} [email]
 * @param {number} [pageNum] For pagination
 * @param {number} [pageSize] For pagination
 * @returns {string} Error
 * @returns {GetEmployeesResp[]}
 * 
 * Service for fetching employees from Users table
 */

function getEmployees(req, resp) {
  ClearBlade.init({request:req});
  
  var query = ClearBlade.Query();
  if (typeof req.params.pageNum =="undefined" ){
    req.params.pageNum=0;
  }
  if (typeof req.params.pageSize =="undefined" ){
    req.params.pageSize=0;
  }
  if (typeof req.params.employee_id !="undefined" && req.params.employee_id!="" ){
    query.equalTo("user_id", req.params.employee_id);
  }
  if (typeof req.params.email !="undefined" && req.params.email!="" ){
    query.equalTo("email", req.params.email);
  }
  query.setPage(req.params.pageSize, req.params.pageNum);

  var user = ClearBlade.User();
  user.allUsers(query, function(err, data) {
    if (err) {
      resp.error(JSON.stringify(data));
    } else {
      resp.success(data.Data);
    }
	});
}
