
var Errors = {

    error: function (req, res, next) {
        var data = {
            status: '404',
            description: 'Not Found',
            user_message:   'Invalid function request ' + req.originalUrl,
            system_message: 'Action is unsupported or missing', 
        };
        var json_str = JSON.stringify(data);  
        res.status(404).send(json_str);
    },


    error400: function(res, user_message, system_message) {
        var data = {
            status:          '400',
            description:     'Bad Request',
            user_message:    user_message,
            system_message:  system_message,
        };
        var json_str = JSON.stringify(data);  
        res.status(400).send(json_str);
    },


    error401: function(res, user_message, system_message) {
        var data = {
            status:          '401',
            description:     'Not Authorized',
            user_message:    user_message,
            system_message:  system_message,
        };
        var json_str = JSON.stringify(data);  
        res.status(401).send(json_str);
    },


    error403: function(res, user_message, system_message) {
        var data = {
            status:          '403',
            description:     'Forbidden',
            user_message:    user_message,
            system_message:  system_message,
        };
        var json_str = JSON.stringify(data);  
        res.status(403).send(json_str);
    },


    error404: function(res, user_message, system_message) {
        var data = {
            status:          '404',
            description:     'Not Found',
            user_message:    user_message,
            system_message:  system_message,
        };
        var json_str = JSON.stringify(data);  
        res.status(404).send(json_str);
    },


    error500: function(res, user_message, system_message) {
        var data = {
            status:          '500',
            description:     'Internal Server Error',
            user_message:    user_message,
            system_message:  system_message,
        };
        var json_str = JSON.stringify(data);  
        res.status(500).send(json_str);
    }

};

module.exports = Errors;




