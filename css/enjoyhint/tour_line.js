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
                selector: '#budgetCB',//jquery selector
                event_type: 'next',
                timeout: 4000,
                description: 'You can focus only on specific criteria by selecting/unselecting them here! E.g. You can select the Budget Only.<br><br>'
            },
            {
                selector: '#mainSlider',//jquery selector
                event_type: 'next',
                description: 'You can zero-in only on a range of certain years -- feel free to adjust to say from Kennedy (1960) till Obama (2009)...<br><br>'
            }
            ,
            {
                selector: '#prev',//jquery selector
                event: 'next',
                description: 'You can navigate back too! Or forward to go to next visualization.'
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