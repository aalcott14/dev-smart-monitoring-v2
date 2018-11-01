/**
 * @typedef NewUser
 * @property {User} user
 * @property {Employee} employee
 */

/**
 * @typedef User
 * @property {string} email Email address of new user
 * @property {string} password Password for new user
 */

/**
 * @typedef Employee
 * @property {string} first_name
 * @property {string} last_name
 * @property {string[]} locations
 * @property {string} phone_number
 * @property {string} photo
 */

/**
 * @typedef CreateEmployeeResponse
 * @property {string} email
 * @property {string} password
 */

/**
 * @param {NewUser} [employee]
 * @param {NewUser[]} [employees] Array containing multiple new user objects in the format above
 * @returns {string} Error
 * @returns {CreateEmployeeResponse} 
 * 
 * Service for creating new employees in Users table
 */

function createEmployee(req, resp) {
  ClearBlade.init({ request: req });

  if (req.params.employee) {
    req.params.employees = [{ user: req.params.user, employee: req.params.employee }]
  }
  req.params.employees.forEach(function (item) {
    if (!item.user.email) {
      resp.error("Email cannot be blank");
    }
    ClearBlade.init({
      systemKey: req.systemKey,
      systemSecret: req.systemSecret,
      registerUser: true,
      email: item.user.email,
      password: item.user.password,
      callback: function (err, body) {
        if (err) {
          resp.error(JSON.stringify(body));
        } else {
          ClearBlade.init({ request: req });
          var user = ClearBlade.User();
          var query = ClearBlade.Query();
          query.equalTo("email", item.user.email);
          user.setUsers(query, item.employee, function (err, data) {
            if (err) {
              resp.error(JSON.stringify(data));
            } else {
              resp.success(data);
            }
          });
        }
      }
    });
  })
}
