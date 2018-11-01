/**
 * @typedef SensorType
 * @property {string} name
 * @property {string} description
 * @property {string} data_type Data type of sensor's data value
 * @property {string} attributes Special character corresponding to data value provided
 * @property {string} icon
 * @property {boolean} isProbe Whether or not sensor is a probe
 */

/**
 * @typedef CreateSensorTypeResp
 * @property {string} item_id
 */

/**
 * @param {SensorType} sensor_type
 * @returns {string} Error
 * @returns {CreateSensorTypeResp[]}
 * 
 * Service for creating new sensor type in SensorTypes collection
 */

function createSensorType(req, resp) {
  ClearBlade.init({ request: req });

  var col = ClearBlade.Collection({ collectionName: "SensorTypes" });
  
  if (req.params.sensor_type) {
    req.params.sensor_types = [req.params.sensor_type]
  }
  const createdList = []
  req.params.sensor_types.forEach(function (item) {
    hasRequiredFields(item, ['name', 'data_type'])
    col.create(item, function (err, data) {
      if (err) {
        resp.error(JSON.stringify(data));
      } else {
        createdList.push(data[0].item_id)
        if (createdList.length === req.params.sensor_types.length) {
          resp.success(createdList);
        }
      }
    });
  })

  function hasRequiredFields(item, requiredFields) {
    requiredFields.forEach(function (keyName) {
      if (!item[keyName]) {
        resp.error(keyName + ' cannot be blank');
      }
    })
  }
}
