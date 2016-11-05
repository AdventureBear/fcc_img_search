/**
 * Created by suzanne on 10/18/16.
 */

//  to use this template you must set up your ENV variables
//  .env file must contain values for
//  MONGOLAB_URI (for mLab projects);
// user & pass for mLab set in .env file (uses dotenv)
//  API_KEY (for google api projects)


var express = require('express');
var mongodb = require('mongodb');
var dotenv = require('dotenv');
var  https = require('https');
var request = require('request');
//var qs = require('querystring');


var app = express();
app.use(express.static('.'));
app.set('port', (process.env.PORT || 5000));
dotenv.config();

var MongoClient = mongodb.MongoClient;


// Connection URL. This is where your mongodb server is running.
// For locally running connection
//var url = 'mongodb://localhost:27017/urlshortener';
var url = process.env.MONGOLAB_URI;
var key = process.env.FLICKR_API_KEY;

// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to database');

    // do some work here with the database.
    app.get('/', function (req, res) {
      res.send(index.html);
    });


    app.get('/api/imagesearch/:tags', function(req,res){
      if (err) throw err;
      var photoColl = [];


      //Original Search String (this works)
      //searchURL =  "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key="
      //  + process.env.FLICKR_API_KEY
      //  + "&tags="
      //  + req.params.tags
      //  + "&sort=relevance&extras=url_l&format=json";

      //using request module & querystring options
      var API = "https://api.flickr.com/services/rest/";
      var query = 10;
      request({
        method: 'GET',
        uri: API,
        qs: {
          api_key: key,
          method: "flickr.photos.search",
          text: req.params.tags,
          format: 'json',
          nojsoncallback:1,
          extras: 'url_l, url_t',
          per_page:query
        }
      }, function(err, response, body){



      //request.get(searchURL, opts, function (err, response, body) {
        if (err) throw err;

        console.log(body);

          var photosArr = JSON.parse(body).photos.photo;
          console.log(photosArr);
          photosArr.forEach(function(photo){
            var url_l = photo.url_l;
            var snippet = photo.title;
            var thumb = photo.url_t;
            var context = 'https://www.flickr.com/photos/'+ photo.owner +'/'+ photo.id;

            var imgobj = {
              url: url_l,
              snippet: snippet,
              thumbnail: thumb,
              context: context
            };

            photoColl.push(imgobj);
          })


        res.send(photoColl)
        //Handle error, and body
      });
      //var tags = res.params.tags;
      //var offset = res.params.offset;
      //console.log(tags, offset);

    })


    //Create the server connection
    app.listen(app.get('port'), function () {
      console.log('Node app is running on port', app.get('port'));
    });


    //Close connection
    db.close;
  }
})