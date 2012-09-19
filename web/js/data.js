Manager.Data = {};

Manager.Data.jsonLoad = function(namespace, route, params) {
    var url = Routing.generate(route, params);

    $.getJSON(url, function(response) {
        $('body').trigger('Manager.' + namespace + ':jsonLoaded', response);
    })
    .error(function() { console.log("Unable to load data from: " + url); })
};

Manager.Data.jsonSave = function(namespace, route, data) {
    var url = Routing.generate(route, params);

    console.log("save");

   // .error(function() { console.log("Unable to send data to: " + url); })
};