
// constructor
var VeeryConfig = function() {
};

VeeryConfig.prototype.getvalues = function() {

    var config_values = {
        couchdb_host:      '127.0.0.1',
        couchdb_port:      '5984',
        database_name:     'couchdbname',  
        author_name:       'authorname',
       
    };

    return config_values;
};

module.exports = VeeryConfig;

