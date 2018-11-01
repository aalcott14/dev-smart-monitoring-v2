/**
 * @typedef SensorMessage
 * @property {string} batteryLevel
 * @property {string} dataValue Sensor reading to be processed
 * @property {string} sensorID Name of sensor from Devices table
 * @property {string} signalStrength
 * @property {string} messageDate Stringified ISO 8601 date
 */

/**
 * @typedef SensorPayload
 * @property {string} edge_id Name of edge
 * @property {SensorMessage} sensor_message
 */

/**
 * @param {string|SensorPayload} body
 * @param {number} pageSize
 * @param {number} pageNum
 * @returns {string} Error
 * @returns {string}
 *
 * Service that processes incoming sensor data triggered by sensor messages
 */

var response = '';

function processSensorMessage(req, resp) {
  ClearBlade.init({ request: req });
  var currentDate = new Date();
  var incomingData =
    typeof req.params.body === 'string'
      ? JSON.parse(req.params.body)
      : req.params.body;
  var sensorObj = incomingData.sensor_message;
  var sensorName = sensorObj.sensorID;
  var sensorData = {
    sensor_reading: sensorObj.dataValue,
    battery_level: parseInt(sensorObj.batteryLevel),
    signal_strength: parseInt(sensorObj.signalStrength),
    reading_time: sensorObj.messageDate,
    edge_id: incomingData.edge_id,
  };
  Q.all([
    updateSensor(), // this should create the sensor if its not found
    updateSensorHistory(),
    publishAlerts(),
  ]).done(function() {
    log(response);
    resp.success(response);
  });

  function updateSensor() {
    var deferred = Q.defer();
    ClearBlade.updateDevice(sensorName, sensorData, true, function(err, data) {
      if (err) {
        response += 'Error updating device: ' + JSON.stringify(data, null, 2);
        var d = Object.assign(sensorData, { name: sensorName });
        createDevice(sensorName, d).then(function() {
          deferred.resolve();
        });
      } else {
        response += "Successfully updated device: " + JSON.stringify(data, null, 2);
      }
      deferred.resolve();
    });
    return deferred.promise;
  }

  function createDevice(name, sensor) {
    sensor.enabled = true;
    sensor.allow_key_auth = true;
    sensor.allow_certificate_auth = true;
    sensor.active_key = '123456';
    sensor.type = '';
    sensor.state = '';
    var deferred = Q.defer();
    ClearBlade.createDevice(name, sensor, false, function(err, data) {
      if (err) {
        response +=
          'Unable to create device: ' + JSON.stringify(data, null, 2);
      } else {
        response +=
          'Successfully created device: ' + JSON.stringify(data, null, 2);
      }
      deferred.resolve();
    });
    return deferred.promise;
  }

  function updateSensorHistory() {
    var col = ClearBlade.Collection({ collectionName: 'sensors_data' });
    sensorData.sensor_id = sensorName;
    var deferred = Q.defer();
    col.create(sensorData, function(err, data) {
      if (err) {
        response +=
          'Error updating sensor history: ' + JSON.stringify(data, null, 2);
      } else {
        response +=
          'Successfully updated sensor history: ' + JSON.stringify(data, null, 2);
      }
      deferred.resolve();
    });
    return deferred.promise;
  }

  function publishAlerts() {
    var query = ClearBlade.Query();
    query.matches('rules', sensorName);
    query.setPage(req.params.pageSize, req.params.pageNum);

    var col = ClearBlade.Collection({ collectionName: 'AlertConfigurations' });
    var deferred = Q.defer();
    col.fetch(query, function(err, data) {
      if (err) {
        response += 'Error publishing alert: ' + JSON.stringify(data, null, 2);
        deferred.resolve();
      } else {
        response +=
          'Successfully published alert: ' + JSON.stringify(data, null, 2);
        checkAlert(data.DATA).then(function() {
          deferred.resolve();
        });
      }
    });
    return deferred.promise;
  }

  function checkAlert(matchingAlertConfigs) {
    var deferred = Q.defer();
    for (var i = 0; i < matchingAlertConfigs.length; i++) {
      var alertConfig = matchingAlertConfigs[i];
      checkAlertViolated(alertConfig).then(function(ruleViolated) {
        if (ruleViolated) {
          //make sure we dont have an existing alert
          response += alertConfig.name + ' BROKEN';
          checkForExistingAlerts(alertConfig).then(function(existingAlertExists) {
            if (!existingAlertExists) {
              createNewAlert(alertConfig).then(function() {
                sendMessage(alertConfig).then(function() {
                  deferred.resolve();
                });
              });
            }
          });
        } else {
          response += alertConfig.name + ' NOT BROKEN';
        }
        deferred.resolve();
      })
    }
    return deferred.promise;
  }

  existingAlertExists = false;
  function checkForExistingAlerts(alertConfig) {
    existingAlertExists = false;
    var query = ClearBlade.Query();
    query.equalTo('is_active', true);
    query.equalTo('configuration_id', alertConfig.item_id);

    var col = ClearBlade.Collection({ collectionName: 'Alerts' });
    var deferred = Q.defer();
    col.fetch(query, function(err, data) {
      if (err) {
        response +=
          'Error fetching Alerts collection to check for existing alert: ' +
          JSON.stringify(data, null, 2);
      } else {
        response +=
          'Successfully fetched Alerts data for existing alert: ' +
          JSON.stringify(data.DATA, null, 2);
        if (data.DATA.length > 0) {
          response +=
            'Alert already created: ' + JSON.stringify(data, null, 2);
          existingAlertExists = true;
        } else {
          response += 'Alert not created yet: ' + JSON.stringify(data, null, 2);
        }
      }
      deferred.resolve(existingAlertExists);
    });
    return deferred.promise;
  }

  function createNewAlert(config) {
    config.type_id = '461b3ffd-b458-48e8-ac84-cf6a82866951';
    var currentTimestamp = new Date(Date.now()).toISOString();
    newAlert = {
      configuration_id: config.item_id,
      customer_id: config.customer_id,
      is_active: true,
      sent_date: currentTimestamp,
      target_users: config.contacts,
      type_id: config.type_id,
    };

    var deferred = Q.defer();
    var col = ClearBlade.Collection({ collectionName: 'Alerts' });
    col.create(newAlert, function(err, data) {
      if (err) {
        response += 'Error creating new alert: ' + JSON.stringify(data, null, 2);
      } else {
        response +=
          'Successfully created new alert: ' + JSON.stringify(data, null, 2);
      }
      deferred.resolve();
    });
    return deferred.promise;
  }

  function sendMessage(config) {
    var messageTypes = ['internal'];
    if (config.priority == 'Medium') {
      messageTypes.push('email');
    } else if (config.priority == 'High') {
      messageTypes.push('email');
      messageTypes.push('sms');
    }
    var payload = 'ALERT: ' + config.name + ' - ' + config.message;
    var targets = JSON.parse(config.contacts);
    var codeEngine = ClearBlade.Code();
    var serviceToCall = 'sendMessage';
    var params = {
      customer_id: config.customer_id,
      messageTypes: messageTypes,
      userEmails: targets,
      payload: payload,
    };
    var deferred = Q.defer();
    log('send message paramts ' + JSON.stringify(params, null, 2));
    codeEngine.execute(serviceToCall, params, false, function(err, data) {
      if (err) {
        response +=
          'Error calling sendMessage service: ' + JSON.stringify(data, null, 2);
      } else {
        response +=
          'Successfully called sendMessage service: ' +
          JSON.stringify(data, null, 2);
      }
      deferred.resolve();
    });
    return deferred.promise;
  }
}
