Manager.Calendar = {
    start: function (params) {
        this.container = $(params.container);
        this.load(params.route);
    },
    
    load: function(route) {
        var url = Routing.generate(route);
        
        var obj = this;
        
        $.getJSON(url, function(response) {
            //everything important happens here
                   
            var view = obj.views[response.view];
            
            view.update(obj.container.find(".days_view"), response.data);
        })
        .error(function() { console.log("Unable to get data from: " + url); })
    },
    
    views: {
        days: {
            update: function (el, data) {
                $.each(data, function(i, val) {
                    el.find("#day_" + i + " .date").html(val.date);
                });
            }
        }
    }
}