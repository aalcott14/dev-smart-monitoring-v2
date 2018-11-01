/**
 * @typedef UpdateEmployeeReq
 * @property {boolean} [first_name]
 * @property {string} [last_name]
 * @property {string[]} [locations] Array of location ids from Locations collection
 * @property {string[]} [phone_number]
 * @property {string} [photo]
 * @property {string} [pin]
 * 
 */

 /**
 * @param {UpdateEmployeeReq} employee
 * @param {string} email
 * @returns {string} Error
 * Service that updates an employee in Users table
 */

function updateEmployee(req, resp) {
  ClearBlade.init({ request: req });

  var query = ClearBlade.Query();
  query.equalTo("email", req.params.email);
  
  var user = ClearBlade.User();
  user.setUsers(query, req.params.employee, function (err, data) {
    if (err) {
      resp.error(JSON.stringify(data));
    } else {
      resp.success("Successfully updated employee");
    }
  });
}
