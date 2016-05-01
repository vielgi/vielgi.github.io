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
                selector: '#mapProjection',//jquery selector
                timeout: 4000,
                description: 'Hover over a president (on the left) to see how they have done!<br><br>'
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