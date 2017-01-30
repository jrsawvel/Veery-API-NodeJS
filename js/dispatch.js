var express        = require('express'),
    bodyParser     = require('body-parser'),
    path           = require('path'),
    errors         = require('./errors'),
    posts          = require('./posts'),


app = express();

app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

/*
app.get('/', function(req, res){
  res.send('hello world');
});

*/

app.get('/api/posts/:id', posts.readpost)


app.use(errors.error);

app.listen(3002);
