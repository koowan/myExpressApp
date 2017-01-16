var express = require('express');
var router = express.Router();

var ig = require('instagram-node').instagram();
ig.use({"client_id": "f1c5d63dc50b401ebe0a98c2276f6fe9", "client_secret": "154457cb15c347d182298967f8e63010"});

/* GET home page. */
router.get('/', function(req, res, next) {
  ig.media_popular(function(err, media, limit){
    if (err) {throw err;}

    var urls = [];
    for (var i = 0; i <media.length; i++){
      urls.push(media[i].images.standard_resolution.url);
    }

    res.render('popular', {urls: urls});
  });
});

function get_most_popular(callback){
  return ig.media_popular(callback);
}
module.exports = router;
