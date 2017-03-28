var request      = require('request')
var report_error = require('./errors');
var auth         = require('./auth');

var VeeryConfig = require('./veeryconfig');
var veery = new VeeryConfig();
var veery_config = veery.getvalues();


var UserSettings = {

    'read': function (req, res) {
      if ( req.query.author !== 'undefined' ) {
        auth.is_valid_login(req.query.author, req.query.session_id, function(logged_in_flag) {
            get_author_info(req.params.author, function(author_obj) {
                if ( author_obj ) {
                    if ( logged_in_flag ) {  
                        author_obj.is_logged_in = 1;
                        author_obj.status = 200;
                        author_obj.description = 'OK';
                        var json_str = JSON.stringify(author_obj);  
                        res.status(200).send(json_str);
                   } else {
                        var tmp_obj;
                        tmp_obj.is_logged_in   = 0;
                        tmp_obj.name           = author_obj.name;
                        tmp_obj.type           = author_obj.type;                        
                        tmp_obj.status         = 200;
                        tmp_obj.description    = 'OK';
                        var json_str           = JSON.stringify(tmp_obj);  
                        res.status(200).send(json_str);
                   }
                } else {
                    report_error.error400(res, "Cannot perform action.", "Insufficient information provided.");
                }
            });    
        });
      } else {
          report_error.error400(res, "Unable to complete action.", "Author name was missing.");
      }   
    },


    'update': function (req, res) {
         var obj = req.body;
         auth.is_valid_login(obj.author, obj.session_id, function(logged_in_flag) {
             if ( !logged_in_flag ) {
                 report_error.error400(res, "Unable to peform action.", "You are not logged in.");
             } else {
                 get_author_info(obj.author, function(author_obj) {
                     if ( !author_obj ) {
                         report_error.error400(res, "Unable to complete action.", "Author not found.");
                     } else if ( author_obj.current_session_id !== obj.session_id ) { 
                         report_error.error400(res, "Unable to peform action.", "You are not logged in.");
                     } else if ( obj.old_email.toLowerCase() === obj.new_email.toLowerCase() ) {
                         report_error.error400(res, "Unable to peform action.", "The provided old and new email addresses are identical.");
                     } else if ( obj.old_email.toLowerCase() !== author_obj.email.toLowerCase() ) {
                         report_error.error400(res, "Unable to peform action.", "The provided old email address does not match the email address contained in the database.");
                     } else if ( obj.id !== author_obj._id ) {
                         report_error.error400(res, "Unable to peform action.", "Invalid user information provided. (A)");
                     } else if ( obj.rev != author_obj._rev ) {
                         report_error.error400(res, "Unable to peform action.", "Invalid user information provided. (B)");
                     } else  {
                         author_obj.email = obj.new_email;
                         report_error.error400(res, obj.author, obj.session_id);
                     }
                 }); 
             }
         });
    }

};


function get_author_info(author_name, callback) {

    var url = veery_config.couchdb_url + veery_config.database_name + '/_design/views/_view/author?key="' + author_name + '"';

    request(url, function(err, res, body) {
        if ( err ) {
            callback(undefined);
        } else {
            var obj = JSON.parse(body); 
            if ( obj.rows[0] != null ) {
                var author_obj = obj.rows[0].value;
                callback(author_obj);
            } else {
                callback(undefined);
            }
        }
    });
}

module.exports = UserSettings;
