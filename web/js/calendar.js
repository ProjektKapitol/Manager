Manager.Calendar = {

    nextButton:".button.next",
    prevButton:".button.prev",

    start:function (params) {
        this.container = $(params.container);

        this.view = this.views[params.view];
        this.view.start();

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
            //TODO get rid of hardcoded values
            ratio: 576 / 60 / 24,
            unassigned:".unassigned",
            scheduled:".scheduled",
            remover:".remove-task",

            taskInner:".task",
            tasks:".tasks li",

            saveButton: "#calendar-save",

            addInput:"#add-task-description",
            addButton:"#add-task-button",

            //current state of data - kept up to date for easy save
            draft: {
                scheduled: [],
                unscheduled: undefined
            },

            start: function() {
                var obj = this;
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

                $(this.saveButton).click(function () {
                    obj.refreshDraft();

                    // unscheduled tasks should be added to draft only on save
                    obj.refreshUnscheduled();

                    console.log(obj.draft);
                    return false
                });

                $(this.scheduled).droppable({
                    accept:this.tasks,

                    drop:function (event, ui) {

                        if (ui.draggable.parent(obj.unassigned).length > 0) {
                            // clone task element
                            var el = obj.createTask({ 'description':ui.draggable.html});
                            obj.makeDraggable(el);

                            var height = ui.draggable.css('height');
                            el.children(obj.taskInner).css('height', height);
                            el.children(obj.taskInner).html(ui.draggable.html());
                            obj.makeResizable(el.children(obj.taskInner));

                            var offset = ui.draggable.parent().offset().top - (ui.draggable.parent().offset().top - $(this).offset().top );

                            var pos = ui.draggable.position().top - offset;

                            el.css('top', pos + "px");

                            var dataCopy = ui.draggable.data('raw');

                            el.data('raw', dataCopy);
                            ui.draggable.remove();

                        } else {
                            var el = ui.draggable;
                            var pos = ui.draggable.position().top;
                        }

                        var taskData = el.data('raw');

                        var dayKey = $(event.target).data('key');
                        var date =  obj.splitDate(dayKey);

                        var dateFull = date;
                        dateFull.h =  Math.floor(pos/24);
                        dateFull.i = Math.round(pos%24*2.5);

                        taskData.startTime = dateFull;
                        console.log(dateFull);

                        taskData.duration = obj.calculateDuration(height);

                        obj.draft.scheduled[dayKey].tasks.push(taskData);

                        el.data('raw', taskData);

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

            calculateDuration: function(height) {
                //TODO get rid of hardcoded values
                return Math.round(parseInt(height) * 2.5);
            },

            refreshDraft: function() {
                var obj = this;
                $(this.scheduled).each(function(key, dayEl) {
                   var dayKey = $(dayEl).data("key");
                   var tasksData = [];
                    $(dayEl).children().each(function(k, taskEl) {
                        tasksData.push ($(taskEl).data("raw"));
                    });
                    obj.draft.scheduled[dayKey].tasks = tasksData;
                });
            },

            refreshUnscheduled:function () {
                var tasksData = [];
                $(this.unassigned).children().each(function (k, taskEl) {
                    tasksData.push($(taskEl).data("raw"));
                });
                this.draft.unscheduled = tasksData;
            },

            createTask:function (d) {
                var el = $('<li><div class="task">' + d.description + '</div></li>');
                el.data('raw', d);
                this.makeResizable($(el).children(this.taskInner));
                return el;
            },

            change:function (n) {
                var obj = this;

                //save the changes to draft
                this.refreshDraft();

                this.refreshUnscheduled();
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
                    if(!obj.draft.scheduled[key]) {
                        obj.draft.scheduled[key] = day;
                    }

                    obj.mainEl.find("#day_" + i + " .date").html($.format.date(key + " 00:00:00", "ddd, dd MMMM, yyyy"));
                    $("#day_" + i + " .tasks").data('key', key);

                    var list = [];
                    $("#day_" + i + " .tasks").html("");


                    //iterate over tasks
                    $.each(obj.draft.scheduled[key].tasks, function (k, task) {
                        var el = obj.createTask(task);

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

                    if(obj.draft.unscheduled == undefined) {
                        obj.draft.unscheduled = data.unscheduled;
                    }
                    //iterate over unscheduled tasks
                    $.each(obj.draft.unscheduled, function (k, task) {

                        var el = obj.createTask(task);

                        //TODO: use element related raw data instead of list
                        list.push({
                            el:el,
                            duration:task.duration
                        });

                        $(obj.unassigned).append(el);

                    });

                    obj.adjust(list, false);

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

            },

            calculateMinutes:function (t) {
                return parseInt(t.h) * 60 + parseInt(t.i);
            },

            splitDate:function (d) {
                var arr = d.split('-');
                return {
                    d: arr[2],
                    m : arr[1],
                    y: arr[0]
                }
            },

            adjust:function (elements, adjust_top) {
                var current = 0;
                var obj = this;
                $.each(elements, function (key, d) {
                    var height = Math.round(d.duration * obj.ratio);
                    if(adjust_top != false) {
                        var top = Math.round(d.offset * obj.ratio) - current;

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