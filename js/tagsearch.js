
var request = require('request')
var report_error = require('./errors');

var utils = require('./utils.js');

var VeeryConfig = require('./veeryconfig');
var veery = new VeeryConfig();
var veery_config = veery.getvalues();



var TagSearch = {

    'do_tag_search': function (req, res) {

        var page_num = 1;

        if ( utils.is_numeric(req.query.page) && req.query.page > 0 ) {
            page_num = req.query.page;
        }

        get_tag_search_posts(page_num, req.params.tag_name, function (posts_array_obj, next_link_bool) {
            if ( posts_array_obj ) {
                var return_obj = {
                    status: 200,
                    posts: posts_array_obj,
                    next_link_bool: next_link_bool,
                    description: 'OK'
                }
                var json_str = JSON.stringify(return_obj);  
                res.status(200).send(json_str);
            } else {
                report_error.error400(res, "Unable to complete action.", "No posts were retrieved.");
            }    
        });




//        console.log('tag search: page = ' + page_num + ' tag = ' + req.params.tag_name); 
//        report_error.error400(res, "test", "tag search");
     }

};



function get_tag_search_posts(page_num, keyword, callback) {

    var max_entries = veery_config.max_entries_on_page;
    var skip_count = (max_entries * page_num) - max_entries;
    var url = veery_config.couchdb_url + veery_config.database_name + '/_design/views/_view/tag_search?descending=true&limit=' + (max_entries + 1) + '&skip=' + skip_count + '&startkey=["' + keyword + '", {}]&endkey=["' + keyword + '"]'     ;

    request(url, function(err, ress, body) {
        if ( err ) {
            callback(undefined);
        } else {
            var obj = JSON.parse(body); // convert JSON string to JavaScript object
            var rows = obj.rows;
            var arrayLength = rows.length;

            var next_link_bool = 0;
            if ( arrayLength > max_entries ) {
                next_link_bool = 1;
                arrayLength--;
            }

            var arr = [];
            for (var i = 0; i < arrayLength; i++) {
                // rows[i].value.formatted_updated_at = rows[i].value.updated_at;
                rows[i].value.formatted_updated_at = utils.format_date_time(rows[i].value.updated_at);
                arr.push(rows[i].value);
            }
            callback(arr, next_link_bool); 
        }
    });

}

module.exports = TagSearch;
