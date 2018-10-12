const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const AWS = require('aws-sdk');


// const Twit = require('twit');

// // New Twit with Heroku Variables
// var T = new Twit({
//     consumer_key:         process.env.CONSUMER_KEY,
//     consumer_secret:      process.env.CONSUMER_SECRET,
//     access_token:         process.env.ACCESS_TOKEN,
//     access_token_secret:  process.env.ACCESS_TOKEN_SECRET
//     // timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
//     // strictSSL:            false,     // optional - requires SSL certificates to be valid.
// });

app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(bodyParser.json({limit: '50mb'}));
var port = process.env.PORT || 4000;

app.use(function(req, res, next) {
    // Important
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res, next) => {
    res.send('Waiting for submissions');
});




app.post('/', (req, res) => {
  if(
    req.body.name === undefined ||
    req.body.name === '' ||
    req.body.name === null
  ){
    return res.json({"success": false, "msg": "name not submitted" });
  }




  var b64content = req.body.media_id;



    //*/ get reference to S3 client
    var s3 = new AWS.S3();

    exports.handler = (event, context, callback) => {
         // let encodedImage =JSON.parse(event.body).user_avatar;
         // let decodedImage = Buffer.from(encodedImage, 'base64');
         var filePath = "avatars/" + event.queryStringParameters.username + ".jpg"
         var params = {
           "Body": b64content,
           "Bucket": "aroctobuckettest",
           "Key": ''
        };
        s3.upload(params, function(err, data){
           if(err) {
               callback(err, null);
           } else {
               let response = {
                   "statusCode": 200,
                   "headers": {
                       "my_header": "my_value"
               },
               "body": JSON.stringify(data),
               "isBase64Encoded": false
           };
               callback(null, response);
           }

           return res.json({"success": true, "msg": "file submitted" });
        });

    };

});


app.listen(port, function () {
    console.log('App listening on port ' + port);
});
