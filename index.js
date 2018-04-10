const express = require('express');
const bodyParser = require('body-parser');
const proxy = require('express-http-proxy');
const path = require('path');

const action = require('./services/action');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static(__dirname + '/public'));
app.use('/imgur', proxy('i.imgur.com'));

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('index', {
    postid: null,
    images: null
  });
});
app.post('/', async function(req, res) {
  let postid = req.body.postid;
  let images = await action.getImages(postid);
  res.render('index', {
    postid: postid,
    images: images
  });
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
