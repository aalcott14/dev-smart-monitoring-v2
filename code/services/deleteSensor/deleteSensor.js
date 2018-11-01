/**
 * @param {string} sensor_id
 * @returns {string}
 * 
 * Service for deleting a sensor from Devices table
 */

function deleteSensor(req, resp) {
  ClearBlade.init({ request: req });
  ClearBlade.deleteDevice(req.params.sensor_id, true, function (err, data) {
    if (err) {
      resp.error(JSON.stringify(data));
    } else {
      resp.success("Successfully deleted sensor");
    }
  });
}
