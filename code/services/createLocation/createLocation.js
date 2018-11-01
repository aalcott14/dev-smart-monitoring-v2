/**
 * @typedef Location
 * @property {string} name
 * @property {string} description
 * @property {string} icon
 * @property {string} location_type Corresponds to item_id of a LocationType
 * @property {string} lat
 * @property {string} long
 */

/**
 * @typedef CreateLocationResponse
 * @property {string} item_id
 */

/**
 * @param {Location} location
 * @returns {string} Error
 * @returns {CreateLocationResponse[]}
 * 
 * Service for creating new locations in Locations collection
 */

function createLocation(req, resp) {
  ClearBlade.init({ request: req });

  var col = ClearBlade.Collection({ collectionName: "Locations" });
  
  if (req.params.location) {
    req.params.locations = [req.params.location]
  }
  function hasRequiredFields(item, requiredFields) {
    requiredFields.forEach(function (keyName) {
      if (!item[keyName]) {
        resp.error(keyName + ' cannot be blank')
      }
    })
  }
  const createdList = []
  req.params.locations.forEach(function (item) {
    hasRequiredFields(item, ['name'])
    col.create(item, function (err, data) {
      if (err) {
        resp.error(JSON.stringify(data));
      } else {
        createdList.push(data[0].item_id)
        if (createdList.length === req.params.locations.length) {
          resp.success(createdList);
        }
      }
    });
  })
}
