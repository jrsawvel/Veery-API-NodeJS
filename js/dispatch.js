var express        = require('express'),
    bodyParser     = require('body-parser'),
    path           = require('path'),
    errors         = require('./errors'),
    posts          = require('./posts'),
    nopwdlink      = require('./loginlink');
    logout         = require('./logout');


app = express();

// app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(bodyParser.json());


/*
app.get('/', function(req, res){
  res.send('hello world');
});

*/

app.get('/api/posts/:id', posts.get_request_for_a_post);
app.get('/api/posts', posts.get_request_for_a_stream);

app.post('/api/users/login', nopwdlink.loginlink);
app.get('/api/users/login', nopwdlink.activatelogin);
app.get('/api/users/logout', logout.logout);

app.use(errors.error);

app.listen(3002);
