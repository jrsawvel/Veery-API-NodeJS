var http    = require('http');

var report_error = require('./errors');

var dbemail = require('./getemailfor.js');
var dbsessionid = require('./createsessionid.js');
var sid = require('./readsessionid.js');
var sendlink = require('./sendloginlink');

var VeeryConfig = require('./veeryconfig');
var veery = new VeeryConfig();
var veery_config = veery.getvalues();

var options = {
  host: veery_config.couchdb_host,
  port: veery_config.couchdb_port,
  path: '',
};


var LoginLink = {

    'loginlink': function (req, res) {
        // incoming json: { "email" : "x@x.com", "url" : "http://clientapp/nopwdlogin"} 

        var obj = req.body; 

        if ( !obj.email || !obj.url ) {
            report_error.error400(res, "Invalid input.", "Insufficent data was submitted.");
        } else { 
            dbemail.get_email_for(veery_config.author_name, function (author_email) {
                if ( obj.email !== author_email ) {
                    report_error.error400(res, "Invalid input.", "Data not found.");
                } else {
                    dbsessionid.create_session_id(function (rev) {
                        if ( rev ) {
                            sendlink.send_login_link(author_email, rev, obj.url, function(send_flag) {
                                if ( send_flag ) {
                                    var return_obj = {
                                        status: 200,
                                        description: 'OK',
                                        user_message: 'Creating New Login Link',  
                                        system_message: 'A new login link has been created and sent.'
                                    }
                                    var json_str = JSON.stringify(return_obj);  
                                    res.status(200).send(json_str);
                                } else {
                                    report_error.error400(res, 'Error sending login link.', 'Link not sent.');
                                }
                            });                         
                        }    
                    }); 

                }
            });
        }
    },


    'activatelogin': function (req, res) {
         if ( req.query.rev ) {
             sid.read_session_id(req.query.rev, function(session_id) {
                 if ( session_id ) {
                     var return_obj = {
                         status: 200,
                         description: 'OK',
                         session_id: session_id,
                         author_name: veery_config.author_name
                     }
                     var json_str = JSON.stringify(return_obj);  
                     res.status(200).send(json_str);
                 } else {
                     report_error.error400(res, "Unable to login.", "Invalid session information submitted.");
                 }     
             });
         } else {
             report_error.error400(res, "Unable to login.", "Invalid user information submitted.");
         }
     }
};


module.exports = LoginLink;
