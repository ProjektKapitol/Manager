Manager.Calendar = {
    start: function (params) {
        this.container = $(params.container);
        this.data = params.data;
        
        var view = this.views[this.data.view];
        view.update(this.container.find(".days_view"), this.data.data);
    },
    
    views: {
        days: {
            update: function (el, data) {
                var i = 0;
                $.each(data, function(key, day) {
                    el.find("#day_" + i + " .date").html(key);
                    $.each(day.tasks, function(k, task) {
                
                    var top = Math.round(task.start * 576 / 60 / 24);                    
                    var height = Math.round(task.duration * 576 / 60 / 24);    
                        var t = $('<li><div class="task-break" style="height: ' + top + 'px"></div><div class="task" style="height: ' + height + 'px; line-height: ' + height + 'px;">' + task.description + '</div></li>');
                        $("#day_" + i + " .tasks").append(t);
                    });
                    
                    i++;
                });
                //TODO add #container to $ getters
                $( ".unasigned, .scheduled" ).sortable({
                    connectWith: ".tasks",
                    placeholder: "task-placeholder",
                    cancel: ".break",
                    forcePlaceholderSize: true
                }).disableSelection();
        
            
                $( ".unasigned, .scheduled" ).bind( "sortstop", function(event, ui) {
                    $(ui.item[0]).children().width("100%");
                });
                
                $( ".tasks li > *" ).resizable({
                    grid: 2,
                    handles: 's',
                    minHeight: 0,
                    resize: function(event, ui) {
                        //behavior of elements on resize
                        ui.element.css('line-height', ui.element.css('height'));
                        if(ui.element.parents(".scheduled").length > 0) {
                            console.log("asd");
                        }
                        
                        //console.log(ui);
                    }
                });
            }
        }
    }
}