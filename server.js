const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

//var Twit = require('twit');

// New Twit with Heroku Variables
// var T = new Twit({
//     consumer_key:         process.env.CONSUMER_KEY,
//     consumer_secret:      process.env.CONSUMER_SECRET,
//     access_token:         process.env.ACCESS_TOKEN,
//     access_token_secret:  process.env.ACCESS_TOKEN_SECRET,
//     // timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
//     // strictSSL:            false,     // optional - requires SSL certificates to be valid.
// })

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
var port = process.env.PORT || 4000;

app.use(function(req, res, next) {
    // Important
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res, next) => {
    res.send('Waiting for tweets');

    // T.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
    //     console.log(data)
    // })

    // If Not Successful
    //     if(body.success !== undefined && !body.success){
    //       return res.json({"success": false, "msg":"Failed captcha verification from live server"});
    //     }
    //
    //If Successful
    //return res.json({"success": true, "msg":"You've hit the server"});
});



//
// app.post('/', (req, res) => {
//   if(
//     req.body.captcha === undefined ||
//     req.body.captcha === '' ||
//     req.body.captcha === null
//   ){
//     return res.json({"success": false, "msg":"Please select captcha"});
//   }
//
//   // Secret Key from Heroku Config Variable 'RECAPTCHA_SECRET'
//   const secretKey = process.env.RECAPTCHA_SECRET;
//
//   // Google's verification URL: https://developers.google.com/recaptcha/docs/verify
//   const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;
//
//   // Make Request To VerifyURL
//   request(verifyUrl, (err, response, body) => {
//     body = JSON.parse(body);
//
//     // If Not Successful
//     if(body.success !== undefined && !body.success){
//       return res.json({"success": false, "msg":"Failed captcha verification from live server"});
//     }
//
//     //If Successful
//     return res.json({"success": true, "msg":"Captcha passed from live server"});
//   });
// });


app.listen(port, function () {
    console.log('App listening on port ' + port);
});
