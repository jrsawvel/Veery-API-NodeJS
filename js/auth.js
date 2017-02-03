const Couchdbjs = require('couchdbjs');

var VeeryConfig = require('./veeryconfig');
var veery = new VeeryConfig();
var veery_config = veery.getvalues();

/*
1. compare the submitted author name, taken from the query string sent to the api, to 
   the author name stored in the config file. if a match, then continue.
2. query couchdb to get the session id for the author. if the couchdb data matches the 
   session id taken from the query string, then continue.
3. query couchdb to see if the session id is active. if it is, then continue.

If all three conditions are met, then the user is considered logged in.
*/

module.exports.is_valid_login = function (submitted_author_name, submitted_session_id, callback) {

  if ( submitted_author_name !== veery_config.author_name ) {
        callback(false);
  } else {

    const db = new Couchdbjs(veery_config.database_name, {port: veery_config.couchdb_port}, function(err, data) {
        if ( err ) {
            callback(false);
        } else {
            db.getDoc(submitted_author_name, function(err, data) {
                if (err) {
                    callback(false);
                } else if ( submitted_session_id !== data.current_session_id ) {
                    callback(false);
                } else {
                    db.getDoc(submitted_session_id, function(err, data) {
                        if (err) {
                            callback(false);
                        } else if ( data.status !== 'active' ) {
                            callback(false);
                        } else {
                            callback(true);
                        }
                    });
                }
            });
        }
    });
  }
}
