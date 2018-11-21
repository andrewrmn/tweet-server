const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
var Twitter = require('twitter');
var OAuth= require('oauth').OAuth;
var Twit = require('twit');
var TWITTER_CONSUMER_KEY = process.env.CONSUMER_KEY;
var TWITTER_CONSUMER_SECRET = process.env.CONSUMER_SECRET;
var oat = '';
var oas = '';
var oav = '';
var b64content = '';
var status = false;



var oa = new OAuth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    TWITTER_CONSUMER_KEY ,
    TWITTER_CONSUMER_SECRET,
    "1.0",
    "http://localhost:4000/auth",
    "HMAC-SHA1"
);

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
        req.body.media_id === undefined ||
        req.body.media_id === '' ||
        req.body.media_id === null
    ){
        return res.json({"success": false, "msg": "name not submitted" });
    }

    b64content = req.body.media_id;

    oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
        if (error) {
            console.log(error);
            return res.json({"success": error });
        }
        else {
            //req.session.oauth = {};
            //req.session.oauth.token = oauth_token;
            console.log('oauth.token: ' + oauth_token);
            //req.session.oauth.token_secret = oauth_token_secret;
            console.log('oauth.token_secret: ' + oauth_token_secret);
            oat = oauth_token;
            oas = oauth_token_secret;
            var response = {
                oauth_token: oauth_token,
                oauth_token_secret: oauth_token_secret
            }
            return res.json({"success": response });
            //return res.send(response)
            //res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token)
        }
    });

});


app.get('/auth', (req, res, next) => {
    res.send('Here');

    var oatoken = req.query.oauth_token;
    var oav = req.query.oauth_verifier;
    var cb = req.query.callbackurl;
	var oats = req.query.oauth_token_secret;
	var oav = req.query.oauth_verifier;

    if( oat != req.query.oauth_token ) {
        console.log('Error: Tokens do not match');
        return res.json({"success": false, "msg": "Twitter authentication failed" });
    } else {
        console.log('passed');


        oa.getOAuthAccessToken(oat,oats,oav,
    		function(error, oauth_access_token, oauth_access_token_secret, results){
    			if (error){
    				console.log(error);
    				res.send("yeah something broke.");
    			} else {
    				//req.session.oauth.access_token = oauth_access_token;
    				//req.session.oauth,access_token_secret = oauth_access_token_secret;
    				results.access_token=oauth_access_token;
    				results.access_token_secret=oauth_access_token_secret;
    				console.log( "login results: " + JSON.stringify(results) );

                    var userAccessToken = results.access_token;
                    var userAccessSecret = results.access_token_secret;


                    var T = new Twit({
                        consumer_key: TWITTER_CONSUMER_KEY,
                        consumer_secret: TWITTER_CONSUMER_SECRET,
                        access_token: userAccessToken,
                        access_token_secret: userAccessSecret
                        // timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
                        //strictSSL:            false     // optional - requires SSL certificates to be valid.
                    });


                    //first we must post the media to Twitter

                    T.post('media/upload', { media_data: b64content }, function (err, data, response) {
                        // now we can assign alt text to the media, for use by screen readers and
                        // other text-based presentations and interpreters
                        var mediaIdStr = data.media_id_string;
                        var altText = "My Octocat"
                        var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

                        T.post('media/metadata/create', meta_params, function (err, data, response) {
                            if (!err) {
                                // now we can reference the media and post a tweet (media will attach to the tweet)
                                var params = { status: 'Check out my Octocat #myOctocat', media_ids: [mediaIdStr] }

                                var getParams = { command: 'STATUS', media_id: [mediaIdStr] }

                                res.send(true);
                                // return res.json({"success": true});

                                // T.get('statuses/update', getParams, function (err, data, response) {
                                //     console.log(data);
                                //     return res.json({"success": data});
                                // })

                                //return res.json({"success": true, "mediaId": data});

                                // T.post('statuses/update', params, function (err, data, response) {
                                //     if (!err) {
                                //         status = true;
                                //     }
                                //     //console.log(data);
                                //     //return res.json({"success": data});
                                // })
                             }
                        })
                    })
    			}
    		}
		);

    }
});

app.post('/status', (req, res) => {
    return res.json({"success": status});
});


app.listen(port, function () {
    console.log('App listening on port ' + port);
});

