/**
 * @typedef CheckAlertConfig
 * @property {AlertRule[]} rules
 * @property {boolean} disabled
 */

/**
 * @typedef AlertRule
 * @property {string} sensor_id
 * @property {string} operator
 * @property {string} value
 * @property {string} property
 */

/**
 * @param {CheckAlertConfig} alertConfig - Alert configuration to to check for violation.
 * @returns {string} Error
 * @returns {boolean} ruleViolated
 * 
 * Library to determine whether or not a rule is violated.
 */

function checkAlertViolated(alertConfig) {
  if (!alertConfig) return false
  var deferred = Q.defer();
  if (!alertConfig.disabled) {
    var ruleViolated = false;
    var rules = JSON.parse(alertConfig.rules)
    var sensorRules = rules.map(function(r) {
      return r.sensor_id
    })
    log("Number of rules for Alert Congfiguration " + alertConfig.name + ":" + rules.length)
    
    Q.all(rules.map(function (rule, i) {
      return getCurrentSensor(rule.sensor_id, function (currentSensor) {
        log('Current sensor: ' + JSON.stringify(currentSensor, null, 2))
        var payload = parsePayload(currentSensor, rule)
        var ruleValue = JSON.parse(rule.value)
        if (rule.operator == "GT" && !ruleViolated) {
          // GT greater than
          ruleViolated = payload > ruleValue;
        } else if (rule.operator === "LT" && !ruleViolated) {
          // LT less than
          ruleViolated = payload < ruleValue;
        } else if (rule.operator === "EQ" && !ruleViolated) {
          // EQ equal
          ruleViolated = payload === ruleValue;
        }
        log("Payload: " + payload)
        log("Rule" + (i + 1) + (ruleViolated ? " was violated:" : " is fine:") + " Payload " + payload + " cannot be " + rule.operator + " ruleValue " + ruleValue);
      })
    })).done(function() {
      deferred.resolve(ruleViolated);
    })
  }
  return deferred.promise;
}

function getCurrentSensor(sensor_id, callback) {
  var deferred = Q.defer();
  var sensor = ClearBlade.Device();
  var query = ClearBlade.Query();
  query.equalTo("name", sensor_id);

  sensor.fetch(query, function (err, data) {
    if (err) {
      return "Error getting current sensor to check if alert violated";
    } else {
      deferred.resolve(callback(data[0]))
    }
  });
  return deferred.promise;
}

function parsePayload(currentSensor, rule) {
  var payload = currentSensor.sensor_reading;
  if (rule.property === 'battery_level') {
    // only two options now for property and defaults to sensor_reading/latest_payload
    payload = currentSensor.battery_level;
  }
  if (payload == "True") {
    payload = true;
  } else if (payload == "False") {
    payload = false;
  } else {
    payload = typeof payload === 'string' ? parseInt(payload) : payload
  }
  return payload
}