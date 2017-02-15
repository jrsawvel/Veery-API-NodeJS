var dateFormat = require('dateformat');

var VeeryConfig = require('./veeryconfig');




module.exports.send_login_link = function (author_email, rev, client_url, callback) {

    var now = new Date();
    var dt = dateFormat(now, "yyyy/mm/dd HH:MM:ss");

    var veery = new VeeryConfig();
    var veery_config = veery.getvalues();

    var mailgun = require('mailgun-js')({apiKey: veery_config.mailgun_api_key, domain: veery_config.mailgun_domain});

    var data = {
        from: veery_config.mailgun_from,
        to: author_email,
        subject: veery_config.site_name + ' Login Link - ' + dt + ' UTC',
        text: 'Click or copy link to log into the site.\n\n' + client_url + '/' + rev
    };

    mailgun.messages().send(data, function (error, body) {
        if ( error ) {
            callback(false);
        } else { 
            callback(true);
        }
    });
}
