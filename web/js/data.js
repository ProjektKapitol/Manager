Manager.Data = {};

Manager.Data.jsonLoad = function(route, params) {
    var url = Routing.generate(route, params);

    $.getJSON(url, function(response) {
        $('body').trigger('Manager.Data:jsonloaded', response);
    })
    .error(function() { console.log("Unable to get data from: " + url); })
};