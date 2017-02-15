const Couchdbjs = require('couchdbjs');

var VeeryConfig = require('./veeryconfig');
var veery = new VeeryConfig();
var veery_config = veery.getvalues();


module.exports.get_email_for = function (submitted_author_name, callback) {

    const db = new Couchdbjs(veery_config.database_name, {port: veery_config.couchdb_port}, function(err, data) {
        if ( err ) {
            callback(undefined);
        } else {
            db.getDoc(submitted_author_name, function(err, data) {
                if (err) {
                    callback(undefined);
                } else {
                    callback(data.email);
                }
            });
        }
    });
}
