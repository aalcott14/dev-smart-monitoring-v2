/**
 * Mailgun - Send emails via Mailgun REST API
 * @typedef Mailgun
 * @param {string} apikey API Key found in Mailgun Console (https://www.mailgun.com/)
 * @param {string} domain Domain ex. mg.yoursite.com, provided by Mailgun
 * @param {string} originEmail origin address from which to send emails, provided by Mailgun
 */
 function Mailgun(apiKey, domain, originEmail){
     
     if(!apiKey || !domain || !originEmail){
         throw new Error("Invalid configuration - must provide apiKey, domain, and originEmail. Can be acquired on Mailgun account home.")
     }
     /**
      * @memberof Mailgun
      * @param {string} body
      * @param {string} subject
      * @param {string} recipient
      */
     function send(body, subject, recipient, callback){
         formattedRecipient = format(recipient)

        var options = {
            auth: {
                user: "api",
                pass : apiKey
            },
            uri : "https://api.mailgun.net/v3/" + domain + "/messages",
            qs: {
                "from": originEmail,
                "to": formattedRecipient,
                "subject": subject,
                "text": body
            },
            strictSSL: false
        };
    
        var requestObject = Requests();
        requestObject.post(options,function(err,data){
            if(err){
                callback(err)
            }else{
                callback(data)
            }
        })
     }
     
     // formats 'rreinold@clearblade' to '<rreinold@clearblade.com'
     function format(recipient){
         return '<' + recipient + '>'
     }
     
     return {
         send
     }
     
 }