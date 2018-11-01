/**
 * @typedef GetHistoryForSensorsResp
 * @property {number} batter_level
 * @property {string} edge_id
 * @property {string} item_id
 * @property {string} reading_time
 * @property {string} sensor_id
 * @property {string} sensor_reading
 * @property {number} signal_strength
 */

/**
 * @param {string[]} sensor_ids Sensors to include in query
 * @param {string} startTime string Beginning of time range in ISO 8601 format
 * @param {string} endTime string Beginning of time range in ISO 8601 format
 * @returns {string} Err
 * @returns {GetHistoryForSensorsResp[]}
 * 
 * Service for fetching a range of sensor history for one or multiple sensors
 */

function getHistoryForSensors(req, resp) {
  ClearBlade.init({request:req});
  log(req.params);
  var rootQuery;
  var attributeNames = [];

  if(req.params.sensor_ids == null || req.params.sensor_ids.length==0){
    resp.error("No sensors provided");
  } else{
    for (var i =0 ;i < req.params.sensor_ids.length; i++){
      var query = ClearBlade.Query();
      query.greaterThan("reading_time", req.params.startTime);
      query.lessThan("reading_time", req.params.endTime);
      query.columns(["reading_time","sensor_id","sensor_reading"])
      query.equalTo("sensor_id", req.params.sensor_ids[i]);
      query.setPage(0, 0);
      if (i==0){
        rootQuery=query;
      }else{
        rootQuery = rootQuery.or(query);
      }
    }
    var col = ClearBlade.Collection({collectionName:"sensors_data"});
    col.fetch(rootQuery, function (err, data) {
      if (err) {	
        resp.error(JSON.stringify(data));
      } else {
        var points = [];
        log(data);
        if (data.DATA.length === 0) {
          resp.success('No data points match this query')
        }
        for (var i=0; i<data.DATA.length;i++){
          var reading = data.DATA[i];
          var point = {};
          point.timestamp = reading.reading_time;
          var readingsSplit = reading.sensor_reading.split("|");
          for (var j=0;j<readingsSplit.length;j++){
            
            var attributeName =reading.sensor_id;
            if (readingsSplit.length>1){
              attributeName = reading.sensor_id+"_"+j
            }
            addAttributeName(attributeName);
            var attributeValue = readingsSplit[j];
            if (attributeValue == "True"){
              attributeValue = 1;
            } else if (attributeValue == "False"){
              attributeValue =0;
            }
            point[attributeName] = attributeValue;
          }  
          points.push(point);
        }
        mergePointsByTimeStamp(points);
      }
    });
  }

  function addAttributeName(attributeName){
    if (attributeNames.indexOf(attributeName) == -1){
      //attributeName doesnt exist so add it here
      attributeNames.push(attributeName);
    }
  }

  function mergePointsByTimeStamp(points) {
    var lastMergedPoint = {};
    for( var j=0; j<attributeNames.length; j++){
      lastMergedPoint[attributeNames[j]]="";
    }
    for (var i=0; i < points.length;i ++) {
      var point = points[i];
      for( var j=0; j<attributeNames.length; j++){
        if (!(attributeNames[j] in point)){
          point[attributeNames[j]]=lastMergedPoint[j];
        } else {
          lastMergedPoint[j]=point[attributeNames[j]];
        }   
      }
    }
     resp.success(points);
  }
}
