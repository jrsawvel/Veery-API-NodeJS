var request = require('request')
var report_error = require('./errors');

var VeeryConfig = require('./veeryconfig');
var veery = new VeeryConfig();
var veery_config = veery.getvalues();

var Logout = {

    'logout': function (req, res) {

        if ( !req.query.author || !req.query.session_id || ( veery_config.author_name !== req.query.author ) ) {
            report_error.error400(res, "Unable to logout.", "Invalid info submitted.");
        } else {
            update_session_info(req.query.session_id, function(flag) {
                if ( flag ) {
                    var return_obj = {
                        status: 200,
                        description: 'OK',
                        logged_out: 'true'
                    }
                    var json_str = JSON.stringify(return_obj);  
                    res.status(200).send(json_str);
                } else {
                    report_error.error400(res, "Unable to logout.", "Invalid info submitted.");
                }
            });
        }
    }
};


function update_session_info(submitted_session_id, callback) {

    var url = veery_config.couchdb_url + veery_config.database_name + '/' + submitted_session_id;

    request(url, function(err, res, body) {
      if ( err ) {
          callback(false);
      } else {
          var obj = JSON.parse(body);
          if ( obj._id !== submitted_session_id  ||  obj.status !== 'active' ) {
              callback(false);
          } else {
              obj.status = 'deleted';
              url = veery_config.couchdb_url + veery_config.database_name + '/' + obj._id;
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


module.exports = Logout;
