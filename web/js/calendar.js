Manager.Calendar = {

    nextButton:".button.next",
    prevButton:".button.prev",

    start:function (params) {
        this.container = $(params.container);
        this.data = params.data;

        this.view = this.views[params.view];
        this.view.calendar = this;
        this.view.range = params.range;

        this.view.mainEl = this.container.find(".days_view");

        var obj = this;

        //next/prev buttons
        $(this.nextButton).click(function () {
            obj.view.change(1);
            return false
        });

        $(this.prevButton).click(function () {
            obj.view.change(-1);
            return false
        });
    },
    plusDays:function (d, n) {
        return new Date(new Date(d.getTime()).setDate(d.getDate() + n));
    },
    formatDate:function (d) {
        return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    },

    views:{
        days:{
            range:{},
            calendar:null,

            unassigned:".unassigned",
            scheduled:".scheduled",
            remover:".remove-task",

            taskInner:".task",
            tasks:".tasks li",

            addInput:"#add-task-description",
            addButton:"#add-task-button",

            createTask:function (d) {
                var el = $('<li><div class="task">' + d.description + '</div></li>');

                this.makeResizable($(el).children(this.taskInner));
                return el;
            },

            change:function (n) {
                var obj = this;
                this.range.from = this.calendar.plusDays(this.range.from, n);
                this.range.to = this.calendar.plusDays(this.range.to, n);

                // TODO move somewhere else
                var range = {'from': Manager.Calendar.formatDate(this.range.from), 'to': Manager.Calendar.formatDate(this.range.to)};
                Manager.Data.jsonLoad('calendar_data', range);

            },
            makeResizable:function (el) {
                el.resizable({
                    grid:2,
                    handles:'s',
                    minHeight:0,
                    resize:function (event, ui) {
                        //behaviour of elements on resize
                        ui.element.css('line-height', ui.element.css('height'));
                    }
                });
            },

            makeDraggable:function (el) {
                el.draggable({
                    connectToSortable:this.unassigned,
                    revert:'invalid',
                    zIndex:100
                }).css('position', 'absolute').css('width', '200px');

            },

            update:function (data) {

                var obj = this;
                var i = 0;

                //iterate over days
                $.each(data.scheduled, function (key, day) {
                    obj.mainEl.find("#day_" + i + " .date").html($.format.date(key + " 00:00:00", "ddd, dd MMMM, yyyy"));

                    var list = [];
                    //iterate over tasks
                    $.each(day.tasks, function (k, task) {

                        var el = obj.createTask({ 'description':task.description });
                        $("#day_" + i + " .tasks").append(el);


                        list.push({
                            offset:obj.calculateMinutes(task.startTime),
                            el:el,
                            duration:task.duration
                        });

                    });

                    //positioning
                    obj.adjust(list);

                    i++;
                });

                var list = [];

                //remove old tasks
                $(obj.unassigned).html("");

                //iterate over unscheduled tasks
                $.each(data.unscheduled, function (k, task) {

                    var el = obj.createTask({ 'description':task.description });

                    list.push({
                        el:el,
                        duration:task.duration
                    });

                    $(obj.unassigned).append(el);
                });

                obj.adjust(list, false);

                //TODO add #container to $ getters
                $(this.unassigned).sortable({
                    forcePlaceholderSize:true,
                    helper:'original',
                    items:"li:not(.inactive)"
                }).bind("sortstop",function (event, ui) {
                        ui.item.children().css('width', '100%');
                        ui.item.css('position', '');
                    }).disableSelection();

                this.makeDraggable($(this.scheduled).children(this.tasks));

                this.makeResizable($(this.tasks).children(this.taskInner));


                //new task
                $(this.addInput).focus(function () {
                    $(this).val('');
                });

                $(this.addButton).click(function () {
                    var val = $(obj.addInput).val();
                    if (val.length > 0) {
                        var el = obj.createTask({'description':val});
                        $(obj.unassigned).append(el);
                    }
                    return false
                });

                $(this.scheduled).droppable({
                    accept:this.tasks,
                    drop:function (event, ui) {

                        if (ui.draggable.parent(obj.unassigned).length > 0) {

                            // clone task element
                            var el = obj.createTask({ 'description':ui.draggable.html});
                            obj.makeDraggable(el);
                            el.children(obj.taskInner).css('height', ui.draggable.css('height'));
                            el.children(obj.taskInner).html(ui.draggable.html());
                            obj.makeResizable(el.children(obj.taskInner));

                            var offset = ui.draggable.parent().offset().top - (ui.draggable.parent().offset().top - $(this).offset().top );

                            el.css('top', (ui.draggable.position().top - offset) + "px");

                            ui.draggable.remove();
                        } else {
                            var el = ui.draggable;
                        }

                        el.appendTo(this);
                        el.css('left', '0px');

                    }
                });

                //remove
                $(this.remover).droppable({
                    accept:this.tasks,
                    drop:function (event, ui) {
                        ui.draggable.remove();
                    }
                });

            },

            calculateMinutes:function (t) {
                return parseInt(t.h) * 60 + parseInt(t.i);
            },

            adjust:function (elements, adjust_top) {

                var current = 0;
                $.each(elements, function (key, d) {
                    //TODO: get rid of hardcoded values
                    var ratio = 576 / 60 / 24;
                    var height = Math.round(d.duration * ratio);
                    if(adjust_top != false) {
                        var top = Math.round(d.offset * ratio) - current;
                        current += top + height;
                        $(d.el).css('top', top + 'px');
                    }

                    $(".task", d.el)
                        .css('height', height + 'px')
                        .css('line-height', height + 'px');
                });
            }
        }
    }
}