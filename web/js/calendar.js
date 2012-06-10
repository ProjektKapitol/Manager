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
                var obj = this;
                $.each(data, function(key, day) {
                    el.find("#day_" + i + " .date").html($.format.date(key +" 00:00:00", "ddd, dd MMMM, yyyy"));
                    
                    var list = [];
                    
                    $.each(day.tasks, function(k, task) {
                    
                        var el = $('<li id="'+ key + '_' + k + '"><div class="task-break"></div><div class="task">' + task.description + '</div></li>');
                        $("#day_" + i + " .tasks").append(el);
                        
                        list.push({
                            offset: obj.calculateMinutes(task.startTime),
                            el: el,
                            duration: task.duration,
                        });

                    });
                    
                    //positioning
                    obj.adjust(list);
                    
                    i++;
                });
                //TODO add #container to $ getters
                $( ".unasigned, .scheduled" ).sortable({
                    connectWith: ".tasks",
                    placeholder: "task-placeholder",
                    items: "li:not(.inactive)",
                    forcePlaceholderSize: true
                }).disableSelection();
            
                $( ".unasigned, .scheduled" ).bind( "sortstop", function(event, ui) {
                    $(ui.item[0]).children().width("100%");
                }).bind( "sortstart", function(event, ui) {
                    $( ".scheduled li" ).css('margin-top', function() { return $(this).find(".task-break").height() + "px" });
                    $( ".tasks li > .task-break" ).hide();
                }).bind( "sortstop", function(event, ui) {
                    $( ".scheduled li > .task-break" ).css('height', function() { return $(this).parents("li").css('margin-top') });
                    $( ".tasks li" ).css('margin-top', 0);
                    $( ".scheduled li > .task-break" ).show();
                });
                
                $( ".tasks li:not(.inactive) > *" ).resizable({
                    grid: 2,
                    handles: 's',
                    minHeight: 0,
                    resize: function(event, ui) {
                        //behaviour of elements on resize
                        ui.element.css('line-height', ui.element.css('height'));
                        if(ui.element.parents(".scheduled").length > 0) {
                            console.log("asd");
                        }
                    }
                });
                
                $( ".tasks li > .tasks" ).resizable( "option" , 'minHeight' , 2 );
                
                //new task input
                $("#add-task-description").focus(function() { $(this).val(''); });
            },
            
            calculateMinutes: function (t) {
                console.log(t);
                return parseInt(t.h)*60 + parseInt(t.i);
            },
            
            adjust: function(elements) {
                //TODO: refactor
                var sum = 0;
                $.each(elements, function(key, d) {
                   sum += d.offset;
                   sum += d.duration;
                });
                console.log(sum);
                
                var current = 0;
                $.each(elements, function(key, d) {
                    //TODO: get rid of hardcoded values
                    var ratio = 576 / 60 / 24;
                    var top = Math.round(d.offset * ratio) - current;                    
                    var height = Math.round(d.duration * ratio);

                    current += top + height;
                    
                    $(".task-break", d.el).height(top);

                    $(".task", d.el).css('height', height + 'px').css('line-height', height + 'px');
                });    

                
            }
        }
    },
}