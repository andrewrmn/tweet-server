const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

const Twit = require('twit');

// New Twit with Heroku Variables
var T = new Twit({
    consumer_key:         process.env.CONSUMER_KEY,
    consumer_secret:      process.env.CONSUMER_SECRET,
    access_token:         process.env.ACCESS_TOKEN,
    access_token_secret:  process.env.ACCESS_TOKEN_SECRET
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
    res.send('Waiting for tweets');
});



app.post('/', (req, res) => {
  if(
    req.body.media_data === undefined ||
    req.body.media_data === '' ||
    req.body.media_data === null
  ){
    return res.json({"success": false, "msg": "name not submitted" });
  }

  var b64content = req.body.media_data;

  //return res.json({"success": true});

    //first we must post the media to Twitter
    //uncomment to Work
    T.post('media/upload', { media_data: b64content }, function (err, data, response) {
        // now we can assign alt text to the media, for use by screen readers and
        // other text-based presentations and interpreters
        var mediaIdStr = data.media_id_string
        var altText = "Small flowers in a planter on a sunny balcony, blossoming."
        var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

        T.post('media/metadata/create', meta_params, function (err, data, response) {
            if (!err) {
                // now we can reference the media and post a tweet (media will attach to the tweet)
                var params = { status: 'loving life #nofilter', media_ids: [mediaIdStr] }

                return res.json({"success": true, "mediaId": display_url});

                // T.post('statuses/update', params, function (err, data, response) {
                //     console.log(data);
                //     return res.json({"success": data});
                // })
             }
        })
    })

});


app.listen(port, function () {
    console.log('App listening on port ' + port);
});
