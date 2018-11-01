/**
 * @param {string[]} messageTypes Indicates the types of messages ("sms", "email", "internal") to send
 * @param {string[]} userEmails Email addresses of users to send message to
 * @param {string} payload Message to send
 * @returns {string} Tally of errors for each type of message
 * 
 * Service that sends text, email, internal, or combination to designated employees
 */

function sendMessage(req, resp) {
  const Buffer = BufferNodeJS().Buffer;
  ClearBlade.init({request:req});
  var msg = ClearBlade.Messaging();
  log("SENDING MESSAGES")
  getUsersByEmail().then(function(employees) {
    sendAllMessages(employees)
  }).catch(function(e) {
    resp.success("Error sending messages: " + JSON.stringify(e));
  })

  function getUsersByEmail(){
    var user = ClearBlade.User();
    var rootQuery = ClearBlade.Query();
    rootQuery.equalTo("email", req.userEmail);
    
    for (var i =0; i<req.params.userEmails.length; i++){
      var query = ClearBlade.Query();
      query.equalTo("email", req.params.userEmails[i]);
      rootQuery.or(query);
    }

    var deferred = Q.defer();
    user.allUsers(rootQuery, function(err, data) {
      if (err) {
        deferred.reject(err);
      }
      deferred.resolve(data.Data);
    });
    return deferred.promise;
  }

  function sendAllMessages(employees){
    var messageCount = 0 ;
    for (var i = 0 ; i < req.params.messageTypes.length; i++){
      var messageType = req.params.messageTypes[i];
      var sender = {
        first_name:"Smart-Monitoring",
        last_name:"Sensor",
        photo : ""
      };
      for (var j=0; j<employees.length;j++){
        var employee = employees[j]
        if (employee.email == req.userEmail){
          sender = employee;
          break;
        }
      }
      for (var j = 0; j < employees.length; j++){
        var employee = employees[j];
        if (messageType== "sms"){
          if (employee.userEmail != req.userEmail){
            sendSMS(employee);
            messageCount++;
          }
        } else if (messageType=="email"){
          if (employee.userEmail!= req.userEmail){
            sendEmail(employee);
            messageCount++;
          }
        } else if(messageType=="internal"){
          sendInternal(sender, employee);
          messageCount++;
        }
      }
    }
    resp.success("Sent messages to: " + JSON.stringify(employees.map(function(emp) { return emp.first_name + " " + emp.last_name }), null, 2));
  }

  function sendSMS(employee){
    var text = req.params.payload+"   https://goo.gl/rqsPH4";
    var recipientNumber = employee.phone_number;
    var twconf = TWILIO_CONFIG;
    const decodedUser= (new Buffer(twconf.USER, 'base64')).toString('ascii');
    const decodedPass = (new Buffer(twconf.PASS, 'base64')).toString('ascii');
    const decodedSourceNumber = (new Buffer(twconf.SOURCE_NUMBER, 'base64')).toString('ascii');
   
    var twilio = Twilio(decodedUser, decodedPass, decodedSourceNumber);
    twilio.sendSMS(text, recipientNumber, function(err, data){
      log('Sending sms to ' + employee.first_name + " " + employee.last_name);
    });
  }

  function sendEmail(employee) {
    var text = req.params.payload + "    https://goo.gl/mZgNvL";
    var recipientEmail = employee.email;
    var mailConf = MAILGUN_CONFIG;
    const decodedKey= (new Buffer(mailConf.API_KEY, 'base64')).toString('ascii');
    const decodedDomain = (new Buffer(mailConf.DOMAIN, 'base64')).toString('ascii');
    const decodedOriginEmail = (new Buffer(mailConf.ORIGIN_EMAIL, 'base64')).toString('ascii');
    var mailgun = Mailgun(decodedKey, decodedDomain, decodedOriginEmail);
    
    mailgun.send(text, "Smart Monitoring System Email", recipientEmail, function(data){
      log('Sending email to ' + employee.first_name + " " + employee.last_name);
    })
  }

  function sendInternal(sender, employee) {
    var topic = "/messaging/" + employee.user_id + "/";
    var customPayload = {
      "timestamp": new Date().toISOString(),
      "text": req.params.payload,
      "senderName": sender.first_name + " " + sender.last_name,
      "avatar": sender.photo
    };
    msg.publish(topic, JSON.stringify(customPayload));
  }
}
