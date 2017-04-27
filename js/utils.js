

module.exports.format_date_time = function (orig_dt) {
    // format of orig_dt is: 2017/02/15 17:07:31

    var tmp_array = orig_dt.split(" ");

    var date = tmp_array[0];
    var time = tmp_array[1];

    var date_array = date.split("/");

    var short_month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return short_month_names[date_array[1]-1] + " " + date_array[2] + "," + " " + date_array[0] + " " + time + " Z";
}

module.exports.is_numeric = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

