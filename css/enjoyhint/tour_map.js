var tour = function () {
    return {
        init: function () {
            //initialize instance
            var enjoyhint_instance = new EnjoyHint({});

            //simple config. 
            //Only one step - highlighting(with description) "New" button 
            //hide EnjoyHint after a click on the button.
            var enjoyhint_script_steps = [
            {
                selector: '#slider',//jquery selector
                event_type: 'next',
                timeout: 2000,
                description: '1. Move the slider to see GDP data for different years for select countries!<br><br>'
            },
            {
                selector: '#mostimportant',//jquery selector
                event_type: 'next',
                timeout: 2000,
                description: '2. Click on a country (on the circle) to see how they compare to the States !<br><br>'
            },
            
            {
                selector: '#usaText',//jquery selector
                event: 'next',
                description: 'Civics 101: Of course, a president works with Congress to pass budgets and laws so here you can easily see if the President, Senate, House were from the same party!<br><br>'
            }
            
            ];

            //set script config
            enjoyhint_instance.setScript(enjoyhint_script_steps);

            if ($(window).width() > 767) {
                //run Enjoyhint script
                enjoyhint_instance.runScript();
            } else {
                $(".wrapper").text("View tour no higher viewport");
            }
        }
    };
}();

$(function () {
    "use strict";
    tour.init();
});