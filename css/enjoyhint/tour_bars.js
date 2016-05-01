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
                selector: '#criteria',//jquery selector
                event_type: 'next',
                timeout: 2000,
                description: 'See how all the presidents stack against the rest for any single economic indicator -- just make your selection!<br><br>'
            },
            {
                selector: '#checky',//jquery selector
                event: 'next',
                description: 'By default you see the presidents in chronological order but you can order to see who was the best or worst by checking here...<br><br>'
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