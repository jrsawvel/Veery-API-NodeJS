
var report_error = require('./errors');
var read         = require('./readpost');
var post_status  = require('./poststatus'); 
var deleted      = require('./deleted');
var stream       = require('./stream');


var Posts = {

    'get_request_for_a_post': function (req, res) {
         if ( req.query.action === "delete"  ||  req.query.action === "undelete" ) {
             post_status.update(req, res);  
         } else {
             read.readpost(req, res);
         }
    },

    'get_request_for_a_stream': function (req, res) {
         if ( req.query.deleted === "yes" ) {
             deleted.get_posts(req, res);
         } else {
             stream.read_stream(req, res, req.query.page); // pass page numm if submitted by client
             // report_error.error400(res, "Stream::read_stream($page_num)", "not yet supported.");
         }
    }
};


module.exports = Posts;
