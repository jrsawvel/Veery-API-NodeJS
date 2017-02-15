var request      = require('request')
var report_error = require('./errors');
var auth         = require('./auth');

var VeeryConfig = require('./veeryconfig');
var veery = new VeeryConfig();
var veery_config = veery.getvalues();

var PostStatus = {

    'update': function (req, res) {
        auth.is_valid_login(req.query.author, req.query.session_id, function(logged_in_flag) {
            if ( logged_in_flag ) {
                if ( req.query.action !== 'delete'  &&  req.query.action !== 'undelete' ) {
                    report_error.error400(res, "Unable to peform action.", "Invalid action submitted.");
                } else {
                    var post_status = undefined;
                    if ( req.query.action === "delete" ) {
                        post_status = 'deleted';
                    } else if ( req.query.action === "undelete"  ) {
                        post_status = 'public';
                    }
                
                    update_post_status(req.params.id, post_status, function(flag) {
                        if ( flag ) {
                            var return_obj = {
                                status: 200,
                                description: 'OK'
                            }
                            var json_str = JSON.stringify(return_obj);  
                            res.status(200).send(json_str);
                        } else {
                            report_error.error400(res, 'Unable to delete post.', 'Post ID "' + req.params.id + '" was not found.');
                        }
                    });
                }
            } else {
                report_error.error400(res, "Unable to peform action.", "You are not logged in.");
            }

        });
    }
};


function update_post_status (post_id, post_status, callback) {
    var url = veery_config.couchdb_url + veery_config.database_name + '/' + post_id;

    request(url, function(err, res, body) {
      if ( err ) {
          callback(false);
      } else {
          var obj = JSON.parse(body);
          if ( !obj._id ) {
              callback(false);
          } else {
              obj.post_status = post_status;
              url = veery_config.couchdb_url + veery_config.database_name + '/' + post_id;
              request.put ({
                  url: url,
                  body: obj,  
                  json: true,
              }, function(err, resp, body) {
                  if ( err ) {
                      callback(false);
                  } else {
                      callback(true);
                  }
             });
          }
      }
    });
}


module.exports = PostStatus;
