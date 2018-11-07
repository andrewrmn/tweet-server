const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

var request = require('request');


// const Twit = require('twit');

// // New Twit with Heroku Variables
var T = new Twit({
    consumer_key:         process.env.CONSUMER_KEY,
    consumer_secret:      process.env.CONSUMER_SECRET,
    app_only_auth:        true
    // access_token:         process.env.ACCESS_TOKEN,
    // access_token_secret:  process.env.ACCESS_TOKEN_SECRET
    // timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
    // strictSSL:            false,     // optional - requires SSL certificates to be valid.
});

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


  T.get('oauth/request_token', { force_login: true }, function(req, res) {
      T.post(function(err, requestToken, requestSecret) {
          if (err)
              res.status(500).send(err);
           return res.json({"success":'falseo', "msg": "name not submitted" });
          else {
              _requestSecret = requestSecret;
              res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + requestToken);
          }
      });
  });



    return res.json({'success': true, 'params': params });

  //return res.json({"success": true});

    // first we must post the media to Twitter
    // T.post('media/upload', { media_data: b64content }, function (err, data, response) {
    //     // now we can assign alt text to the media, for use by screen readers and
    //     // other text-based presentations and interpreters
    //     var mediaIdStr = data.media_id_string
    //     var altText = "Small flowers in a planter on a sunny balcony, blossoming."
    //     var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
    //
    //     T.post('media/metadata/create', meta_params, function (err, data, response) {
    //         if (!err) {
    //             // now we can reference the media and post a tweet (media will attach to the tweet)
    //             var params = { status: 'loving life #nofilter', media_ids: [mediaIdStr] }
    //
    //           // return res.json({"success": params});
    //
    //             T.post('statuses/update', params, function (err, data, response) {
    //                 console.log(data);
    //                 return res.json({"success": data});
    //             })
    //          }
    //     })
    // })


  // var message = "Hello world, my name is" + req.body.name + "!";
  // T.post('statuses/update', { status: message }, function(err, data, response) {
  //     //console.log(data);
  //     return res.json({"success": data});
  // })


});


app.listen(port, function () {
    console.log('App listening on port ' + port);
});
