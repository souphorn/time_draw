jQuery.fn.scheduleTime = function(options) {
    var func = "default";
    if (typeof (options) == "string")
    {
        func = options;
    }


    this.getData = function() {

        console.log(this.length);
        var _this = this;
        var rets = new Array();
        var times = this.find(".time_block");
        var _options = JSON.parse($(this).find(".schedule_header").attr("data-options"));
        times.each(function(i){

            //Start
            var start = _options.time[0] + ($(this).offset().left - _this.offset().left)/60;
            var startHour = parseInt(start);
            var startMinute = ((start - parseInt(start)) * 60/100)*100;
            if (startMinute == 0) startMinute = "00";

            //End
            var end = $(this).width() / 60;
            var endHour = parseInt(end);
            var endMinute = ((end - parseInt(end)) * 60/100)*100;

            endHour = startHour + endHour;
            endMinute = startMinute + endMinute;
            if (endMinute > 59) {
                endHour += parseInt(endMinute / 60);
                endMinute = endMinute % 60;
            }

            end = endHour + ":" + endMinute;
            start = startHour + ":" + startMinute;


            rets.push({"start":start, "end":end});
        })
        return rets;
    }

    if (func != "default") {
        return eval("this."+func+"()");
    }

    this.prepareHeader = function(header, from, to) {
        for (var i = from; i <= to; i++) {
            header.append("<div style='float:left; position: relative; width:55px;border-left:1px solid #ccc; padding-left: 4px;'>"+i+"</div>");
        }
        header.append("<div style='clear:both;'></div>");
        return header;
    }
    var _this = this;
    var index = 1;
    var selected;

    this.mousedown(function(e) {
        index++;
        var offset = $(_this).offset();
        var left = e.pageX - offset.left;

        var width = '15px';

        var clickedElement = $(document.elementFromPoint(e.pageX, e.pageY));
        if (clickedElement.hasClass("time_block")) {
            _timeSelect(clickedElement);
            return;
        }
        var timeHtml = jQuery('<div style="width: 30px; background: green; height: 20px; position:absolute; float:left;" class="time_block"></div>')
            .css({
                'background':'blue',
                'width':width,
                'left':left,
                'zIndex':index
            });
        selected = timeHtml;
        $(this).find(".schedule_container").append(timeHtml);

        $(this).bind("mousemove", function(e){e.preventDefault();_mousemove(e)});
    })

    this.mouseup(function(e){
        reAdjustPosition(this);
        $(this).unbind("mousemove");
        //$(this).find(".time_block").
    })

    _mousemove = function(e)
    {
        if (!selected) return;
        var newWidth = (e.pageX - selected.offset().left);
        if (newWidth % 15 != 0)
            newWidth = newWidth - (newWidth %15);
        selected.width(newWidth);
    }

    _timeSelect = function(obj) {
        $(".time_block").removeClass("selected");
        $(obj).addClass("selected");
    }

    reAdjustPosition = function (obj) {
        var l = $(obj).offset().left;
        var ll = $(selected).offset().left - l;
        if (ll % 15 != 0) {
            ll -= (ll%15);
        }
        ll += l;
        $(selected).css("left",ll);

    }

    jQuery(document).bind("keydown", function(e) {
        if (e.keyCode == 46) {
            jQuery('.time_block.selected').remove();
        }
    });


    this.default = function() {
        var container = $("<div class='schedule_container'></div>");
        var schedule_width = ((options.time[1] - options.time[0]) +1) * 60;
        container.css({"width":schedule_width, "height":"20", "background":"url('img/bg_schedule.gif')"});

        var header = $("<div class='schedule_header' data-options='"+JSON.stringify(options)+"'></div>");

        var from = options.time[0];
        var to = options.time[1];

        header = this.prepareHeader(header, from, to);
        this.append(header);
        this.append(container);
    }

    this.default();

}


