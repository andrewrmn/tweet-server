const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const AWS = require('aws-sdk');


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
        req.body.image === undefined ||
        req.body.image === '' ||
        req.body.image === null
    ){
        return res.json({"success": false, "msg": "name not submitted" });
    }

    AWS.config.update({ accessKeyId: process.env.AWS_KEY, secretAccessKey: process.env.AWS_SECRET });

    let b64content = req.body.image;
    let decodedImage = Buffer.from(b64content, 'base64');
    let filename = 'my-octocat-' + Date.now() + '.png';
    let s3 = new AWS.S3();

    s3.putObject({
        Bucket: 'aroctobuckettest',
        Key: filename,
        Body: decodedImage,
        ACL: 'public-read'
    },function (err, resp) {
        if(err) {
            return res.json({"success": false });
       } else {
            console.log(arguments);
            console.log('Successfully uploaded package.');
            return res.json({"success": true });
       }
    });


});


app.listen(port, function () {
    console.log('App listening on port ' + port);
});
