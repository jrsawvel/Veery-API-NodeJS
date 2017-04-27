
var express        = require('express'),
    bodyParser     = require('body-parser'),
    path           = require('path'),
    errors         = require('./errors'),
    posts          = require('./posts'),
    nopwdlink      = require('./loginlink'),
    logout         = require('./logout'),
    user           = require('./usersettings'),
    tags           = require('./tagsearch');
    search         = require('./stringsearch');


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
app.get('/api/users/:author', user.read);
app.put('/api/users', user.update);

app.get('/api/searches/tag/:tag_name', tags.do_tag_search);

app.get('/api/searches/string/:string', search.do_string_search);


app.use(errors.error);

app.listen(3002);
