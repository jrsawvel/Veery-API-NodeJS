var request = require('request')
var dateFormat = require('dateformat');

var VeeryConfig = require('./veeryconfig');
var veery = new VeeryConfig();
var veery_config = veery.getvalues();


// update couchdb to change status for the session id from pending to active
// and return the session id.

module.exports.read_session_id = function (rev, callback) {


var url = veery_config.couchdb_url + veery_config.database_name + '/_design/views/_view/session_id?key="'  + rev + '"';

var now = new Date();
var dt = dateFormat(now, "yyyy/mm/dd HH:MM:ss");

request(url, function(err, res, body) {
      if ( err ) {
          callback(undefined);
      } else {
          var obj = JSON.parse(body);
          if ( !obj.rows[0] ) {
              callback(undefined);
          } else {
              var session_obj = obj.rows[0].value;
              if ( session_obj.status !== 'pending' || session_obj._rev !== rev ) {
                  callback(undefined);
              } else {
                  // update the session id doc
                  session_obj.status = 'active';
                  session_obj.updated_at = dt; 
                  url = veery_config.couchdb_url + veery_config.database_name + '/' + session_obj._id;
                  request.put ({
                      url: url,
                      body: session_obj,  
                      json: true,
                    }, function(err, resp, body) {
                        if ( err ) {
                            callback(undefined);
                        } else {
                            // get current user info
                            url = veery_config.couchdb_url + veery_config.database_name + '/_design/views/_view/author?key="' + veery_config.author_name + '"'; 
                            request(url, function(err, res, body) {
                            if ( err ) {
                                callback(undefined);
                            } else {
                                var tmp_obj = JSON.parse(body);
                               if ( !tmp_obj.rows[0] ) {
                                   callback(undefined);
                               } else { 
                                var author_obj = tmp_obj.rows[0].value;
                                author_obj.current_session_id = session_obj._id;
                                url = veery_config.couchdb_url + veery_config.database_name + '/' + author_obj._id;
                                request.put ({
                                    url: url,
                                    body: author_obj,
                                    json: true,
                                  }, function (err, resp, body) {
                                      if ( err ) {
                                          callback(undefined);
                                      } else {
                                          callback(session_obj._id);
                                      }
                                 });
                              }
                            }  
                            }); 
                        }
                  });
              }
          }
      }
    })





}
