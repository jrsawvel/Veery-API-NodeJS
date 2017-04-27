
// constructor
var VeeryConfig = function() {
};

VeeryConfig.prototype.getvalues = function() {

    var config_values = {
        couchdb_host:      '127.0.0.1',
        couchdb_port:      '5984',
        couchdb_url:       'http://127.0.0.1:5984/', 
        database_name:     'veerydvlp1',  
        author_name:       'JohnR',
        mailgun_api_key:   'key-5l7fk1h9d4xowey4-arizir8d1pfj2l6',
        mailgun_domain:    'maketoledo.com',
        mailgun_from:      'MakeToledo <postmaster@maketoledo.com>',
        site_name:         'Veery API NodeJS', 
        max_entries_on_page: 15,
    };

    return config_values;
};

module.exports = VeeryConfig;

