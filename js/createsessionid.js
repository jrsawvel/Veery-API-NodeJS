var request = require('request')
var dateFormat = require('dateformat');

var VeeryConfig = require('./veeryconfig');
var veery = new VeeryConfig();
var veery_config = veery.getvalues();



module.exports.create_session_id = function (callback) {

var now = new Date();
var dt = dateFormat(now, "yyyy/mm/dd HH:MM:ss");


request.post ({
    url: veery_config.couchdb_url + veery_config.database_name,
    body: {type: 'session_id', status: 'pending', created_at: dt, updated_at: dt},
    json: true,
  }, function(err, resp, body) {
      if ( err ) {
          callback(undefined);
      } else {
          callback(body.rev);
      }
  })


}
