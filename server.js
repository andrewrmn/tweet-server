const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

var Twit = require('twit');

// // New Twit with Heroku Variables
var T = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    app_only_auth: true,
    //access_token:         process.env.ACCESS_TOKEN,
    //access_token_secret:  process.env.ACCESS_TOKEN_SECRET
    // timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
    //strictSSL:            false     // optional - requires SSL certificates to be valid.
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
    res.send('Waiting for tweets...');
});


app.post('/', (req, res) => {
  if(
    req.body.media_id === undefined ||
    req.body.media_id === '' ||
    req.body.media_id === null
  ){
    return res.json({"success": false, "msg": "name not submitted" });
  }

  var b64content = req.body.media_id;
  
  var cUrl = 'https://twitter.com/ireckonimdrew/gls-app';
  var cUrl = 'https://andrewross.co/';
    
  var callbackUrl = encodeURIComponent(cUrl);
    
  T.post('https://api.twitter.com/oauth/request_token', { 'oauth_callback' : 'oob' }, function(err, data, response) {
      if (err)
          //res.status(500).send(err);
          return res.json({"success": data });
      else {
          return res.json({"success": data });
         /// _requestSecret = requestSecret;
         // res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + requestToken);
      }
  });
    
  
  
    
  
//     var cKey = T.getAuth().consumer_key;
//     var cSec = T.getAuth().consumer_secret;
    
//     return res.json({"success": T.getAuth().consumer_key });
   
    
//     T.get('account/verify_credentials', { skip_status: true })
//       .catch(function (err) {
//         console.log('caught error', err.stack)
//       })
//       .then(function (result) {
//         // `result` is an Object with keys "data" and "resp".
//         // `data` and `resp` are the same objects as the ones passed
//         // to the callback.
//         // See https://github.com/ttezel/twit#tgetpath-params-callback
//         // for details.

//         console.log('data', result.data);
//       })

  //T.post('oauth/request_token', function(req, res) {
//       T.post('oauth/request_token', function(err, requestToken, requestSecret) {
//           if (err)
//               res.status(500).send(err);
//            return res.json({"success":'falseo', "msg": "name not submitted" });
//           else {
//               _requestSecret = requestSecret;
//               res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + requestToken);
//           }
//       });
  //});



  //return res.json({'success': true });

    // first we must post the media to Twitter
//     T.post('media/upload', { media_data: b64content }, function (err, data, response) {
//         // now we can assign alt text to the media, for use by screen readers and
//         // other text-based presentations and interpreters
//         var mediaIdStr = data.media_id_string;
//         var mediaId = data.media_id;
//         var mediaData = data;
//         var altText = "Small flowers in a planter on a sunny balcony, blossoming."
//         var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
    
//         T.post('media/metadata/create', meta_params, function (err, data, response) {
//             if (!err) {
//                 // now we can reference the media and post a tweet (media will attach to the tweet)
//                 var params = { status: '#myOctocat', media_ids: [mediaIdStr] }
                
// //                 T.get('media/upload', { command: 'STATUS', media_id: mediaId }, function (err, data, response) {
// //                      if (!err) {
// //                           return res.json({'success': data });
// //                      } else {
// //                          return res.json({'success': false });
// //                      }
// //                 });
                
//                 //return res.json({'success': false });
                
//                 //return res.json({"success": params});
    
//                 T.post('statuses/update', params, function (err, data, response) {
//                     //console.log(data);
//                     return res.json({"success": data.entities.media[0].media_url});
//                 })
//              } else {
//                 return res.json({'success': 'falseO' });   
//              }
//         })
//     })


  // var message = "Hello world, my name is" + req.body.name + "!";
  // T.post('statuses/update', { status: message }, function(err, data, response) {
  //     //console.log(data);
  //     return res.json({"success": data});
  // })


});


app.listen(port, function () {
    console.log('App listening on port ' + port);
});
