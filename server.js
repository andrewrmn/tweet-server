const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
var Twitter = require('twitter');

var OAuth= require('oauth').OAuth;


var TWITTER_CONSUMER_KEY = process.env.CONSUMER_KEY;
var TWITTER_CONSUMER_SECRET = process.env.CONSUMER_SECRET;


var oat="";
var oas="";
var oav="";

var oa = new OAuth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    TWITTER_CONSUMER_KEY ,
    TWITTER_CONSUMER_SECRET,
    "1.0",
    "https://twitter.com/ireckonimdrew/gls-app",
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

    var b64content = req.body.media_id;

    var cUrl = 'https://twitter.com/ireckonimdrew/gls-app';
    var cUrl = 'https://andrewross.co/';

    var callbackUrl = encodeURIComponent(cUrl);

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
            oat=oauth_token;
            oas=oauth_token_secret;
            var response={
                oauth_token: oauth_token,
                oauth_token_secret: oauth_token_secret
            }
            //return res.send(response)
            res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token)
        }
    });

});


app.listen(port, function () {
    console.log('App listening on port ' + port);
});
