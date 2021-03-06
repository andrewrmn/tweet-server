const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
var Twitter = require('twitter');
var OAuth= require('oauth').OAuth;
var Twit = require('twit');
const AWS = require('aws-sdk');


var TWITTER_CONSUMER_KEY = process.env.CONSUMER_KEY;
var TWITTER_CONSUMER_SECRET = process.env.CONSUMER_SECRET;

var oat = '';
var oas = '';
var oav = '';
var b64content = '';


var oa = new OAuth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    TWITTER_CONSUMER_KEY ,
    TWITTER_CONSUMER_SECRET,
    "1.0",
    "http://octocat.andrewross.co/close",
    "HMAC-SHA1"
);


app.use(cors());
app.options('*', cors());

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
    res.send('Waiting for submission');
});


app.post('/auth', (req, res) => {
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

app.post('/tweet', (req, res) => {

    if(
        req.body.media_id === undefined ||
        req.body.media_id === '' ||
        req.body.media_id === null
    ){
        return res.json({"success": false, "msg": "No image data" });
    }

    // Get Twitter Response Values
    var oatoken = req.body.oauth_token;
    var oav = req.body.oauth_verifier;
	var oats = req.body.oauth_token_secret;
    b64content = req.body.media_id;

    var text = req.body.tweetText;
    if(
        req.body.tweetText === undefined ||
        req.body.tweetText === '' ||
        req.body.tweetText === null
    ){
        text = '#myoctocat is out of the bag… build your own at myoctocat.com';
    }

    var text = req.body.tweetText;
    if(
        req.body.tweetText === undefined ||
        req.body.tweetText === '' ||
        req.body.tweetText === null
    ){
        text = '#myoctocat is out of the bag… build your own at myoctocat.com';
    }

    // Make sure oath tokens match
    if( oat != oatoken ) {
        console.log('Error: Tokens do not match');
        return res.json({"success": false, "msg": "Twitter authentication failed" });
    } else {
        console.log('passed');

        oa.getOAuthAccessToken(oat,oats,oav,
    		function(error, oauth_access_token, oauth_access_token_secret, results){
    			if (error){
    				console.log(error);
    				res.send("yeah something broke.");
				return res.json({"success": false, "msg": "oAuth Fail"});
    			} else {
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
                    });


                    // Post the media to Twitter
                    T.post('media/upload', { media_data: b64content }, function (err, data, response) {
                        // now we can assign alt text to the media, for use by screen readers and
                        // other text-based presentations and interpreters
                        var mediaIdStr = data.media_id_string;
                        var altText = "My Octocat"
                        var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

                        T.post('media/metadata/create', meta_params, function (err, data, response) {
                            if (!err) {
                                // now we can reference the media and post a tweet (media will attach to the tweet)
                                var params = { status: text, media_ids: [mediaIdStr] }

                                var getParams = { command: 'STATUS', media_id: [mediaIdStr] }

                                //return res.json({"success": true});

                                // Actually Post on Twitter
                                T.post('statuses/update', params, function (err, data, response) {
                                    if (!err) {
                                        return res.json({"success": true});
                                    }
                                    console.log(data);
                                })
                             } else {
                                return res.json({"success": false, "msg": "Posting issue"});
                            }
                        })
                    })
    			}
    		}
		);

    }
});

app.post('/aws', (req, res) => {
    if(
        req.body.image === undefined ||
        req.body.image === '' ||
        req.body.image === null
    ){
        return res.json({'success': false, 'msg': 'img not submitted' });
    }

    AWS.config.update({ accessKeyId: process.env.AWS_KEY, secretAccessKey: process.env.AWS_SECRET });

    var emailAddress = req.body.email;
    let b64content = req.body.image;
    let decodedImage = Buffer.from(b64content, 'base64');
    let filename = 'my-octocat-' + Date.now() + '.png';
    let s3 = new AWS.S3();

    s3.putObject({
        Bucket: 'octocat-generator-gh-origin',
        Key: filename,
        Body: decodedImage,
        ACL: 'public-read'
    },function (err, resp) {
        if(err) {
            return res.json({'success': false });
        } else {
            // On successful image submissions
            var imgUrl = 'https://octocat-generator-assets.githubusercontent.com/' + filename;
            var source = 'web';
            var formName = 'octocat-generator-form';
            var formId = '88570519';
            var url = 'https://s88570519.t.eloqua.com/e/f2';
            var params = 'elqFormName='+ formName +'&elqSiteID='+ formId +'&emailAddress='+ emailAddress +'&gitHubOctocatURL='+ imgUrl +'&sourceURL='+ source +'';

            return res.json({'success': true, 'url': url, 'params': params, 'imgUrl': imgUrl });
        }
    });
});

app.listen(port, function () {
    console.log('App listening on port ' + port);
});
