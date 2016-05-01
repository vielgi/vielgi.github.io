tourScript = null;
var cookieHint = 'vl.index.hint';

$(function () {
    "use strict";
    ch();    
});

function ch()
{   
   // var c = $.cookie(cookieHint);
   // if (c == undefined) {
   //     runTour();
        //tour.init();

        // put session cookie
    //    $.cookie(cookieHint, '1', { domain: '', path: '' });
   // }
    runTour();
    $("#help").click(function (e) {
        e.preventDefault();
        runTour();
        //tour.init();
    });
}

function runTour()
{
    if (tourScript == null)
    {
            var enjoyhint_instance = new EnjoyHint({
                onStart: function () {
                   
                }
            });

            //simple config. 
            //Only one step - highlighting(with description) "New" button 
            //hide EnjoyHint after a click on the button.
            var enjoyhint_script_steps = [
            {
                selector: '#ctl00_content_ApplicationDate',//jquery selector
                event_type: 'next',
                //timeout: 8000,
                description: 'Hallo, you must approve'
            },
            {
                selector: '#help',//jquery selector
                event_type: 'next',
                description: 'Finally, you can always see these hints by pressing the hint button!'
            }
           
            ];

            //set script config
            enjoyhint_instance.setScript(enjoyhint_script_steps);

            tourScript = enjoyhint_instance;
    }    

    $.scrollTo(0);

    if ($(window).width() > 767) {
        //run Enjoyhint script
        tourScript.runScript();                
    } else {
        $(".wrapper").text("View tour no higher viewport");
    }
}