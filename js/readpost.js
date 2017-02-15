var http    = require('http');

var report_error = require('./errors');
var auth = require('./auth.js');

var VeeryConfig = require('./veeryconfig');
var veery = new VeeryConfig();
var veery_config = veery.getvalues();

var options = {
  host: veery_config.couchdb_host,
  port: veery_config.couchdb_port,
  path: '',
};


var ReadPost = {

    'readpost': function (req, res) {

        options.path = '/' + veery_config.database_name + '/' + req.params.id;

        http.get(options, function(getres) {
            var get_data = '';
            getres.on('data', function (chunk) {
                get_data += chunk;
            });

        getres.on('end', function() {
            var obj = JSON.parse(get_data);

            if ( getres.statusCode < 300 ) {

                        var return_obj = {
                            status: 200,
                            description: 'OK',
                            post: {
                                slug:          obj._id,
                                author:        obj.author,
                                created_at:    obj.created_at,
                                updated_at:    obj.updated_at,
                                reading_time:  obj.reading_time,
                                word_count:    obj.word_count,
                                post_type:     obj.post_type, 
                                title:         obj.title
                            }
                        }  

                        if ( req.query.text === 'markup' ) {
                            return_obj.post.markup = obj.markup;
                        } else if ( req.query.text === 'full' ) {
                            return_obj.post.html = obj.html;
                            return_obj.post.markup = obj.markup;
                        } else if ( req.query.text === 'html' ) {
                            return_obj.post.html = obj.html;
                        } else {
                            return_obj.post.html = obj.html;
                        }

                        auth.is_valid_login(req.query.author, req.query.session_id, function(logged_in_flag) {
                            if ( logged_in_flag ) {
                                return_obj.post._rev = obj._rev;
                                var json_str = JSON.stringify(return_obj);  
                                res.status(200).send(json_str);
                            } else {
                                var json_str = JSON.stringify(return_obj);  
                                res.status(200).send(json_str);
                            } 
                       });
     
            } else  {
                report_error.error404(res, 'Post unavailable', 'Post ID not found ' + req.params.id);
            }
        });
        }).on('error', function(e) {
            report_error.error500(res, 'Database error', 'Unable to connect to server');
        });
    }
};


module.exports = ReadPost;

