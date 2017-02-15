
var request        = require('request')
var report_error   = require('./errors');
var auth           = require('./auth');
var VeeryConfig    = require('./veeryconfig');
var veery          = new VeeryConfig();
var veery_config   = veery.getvalues();


var Deleted = {

    'get_posts': function (req, res) {
        auth.is_valid_login(req.query.author, req.query.session_id, function(logged_in_flag) {
            if ( logged_in_flag ) {
                get_deleted_posts( function (posts_array_obj) {
                    if ( posts_array_obj ) {
                        var return_obj = {
                            status: 200,
                            posts: posts_array_obj,
                            description: 'OK'
                        }
                        var json_str = JSON.stringify(return_obj);  
                        res.status(200).send(json_str);
                    } else {
                        report_error.error400(res, "Unable to complete action.", "No deleted posts were retrieved.");
                    }    
                });
            } else {
                report_error.error400(res, "Unable to peform action.", "You are not logged in.");
            }
        });
    }
};


function get_deleted_posts(callback) {

    var url = veery_config.couchdb_url + veery_config.database_name + '/_design/views/_view/deleted_posts/?descending=true';

    request(url, function(err, res, body) {
        if ( err ) {
            callback(undefined);
        } else {
            var obj = JSON.parse(body); // convert JSON string to JavaScript object
            var rows = obj.rows;
            var arrayLength = rows.length;
            var arr = [];
            for (var i = 0; i < arrayLength; i++) {
                arr.push(rows[i].value);
            }
            callback(arr); 
        }
    });
}

module.exports = Deleted;
