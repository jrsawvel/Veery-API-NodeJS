
const Couchdbjs = require('couchdbjs');


var report_error = require('./errors');


var Posts = {

    'readpost': function (req, res) {

        const db = new Couchdbjs('veerydvlp1', {port: 5984}, function(err, data) {
            if ( err ) {
                report_error.error500(res, 'Server Problem', 'Unable to connect to database');
            }
        });
 
                db.getDoc(req.params.id, function(err, data) {
                    if (err) {
                        report_error.error404(res, 'Unable to display post', 'Post ID ' + req.params.id + ' was not found');
                    } else {

                        var return_obj = {
                            status: 200,
                            description: 'OK',
                            post: {
                                slug:          data._id,
                                html:          data.html,
                                author:        data.author,
                                created_at:    data.created_at,
                                updated_at:    data.updated_at,
                                reading_time:  data.reading_time,
                                word_count:    data.word_count,
                                post_type:     data.post_type, 
                                title:         data.title
                            }
                        }  
                        var json_str = JSON.stringify(return_obj);  
                        res.status(200).send(json_str);
                    }
                }); 
     }
};

module.exports = Posts;

