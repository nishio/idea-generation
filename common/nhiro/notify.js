/**
 * (c) 2013, Cybozu.
 * Growl-like notification.
 * Require: jQuery, jQuery UI Dialog
 */
goog.provide('nhiro.notify');

nhiro.notify.top_filled = false;
nhiro.notify.last = null;

nhiro.notify = function(message, seconds){
    var $ = nhiro.repos.get('jQuery');
    var box = $('<div>');
    if(seconds == null) seconds = 10;

    box.text(message);
    box.appendTo('body');
    var position;
    if(nhiro.notify.top_filled){
        position = {my: 'right top', at: 'right bottom', of: nhiro.notify.last};
        function onClose(){};
    }else{
        position = {my: 'right top', at: 'right top', of: $('body')};
        nhiro.notify.top_filled = true;
        function onClose(){
            nhiro.notify.top_filled = false;
        };
    }
    var dialog = box.dialog({
        position: position,
        resizable: false,
        draggable: false,
        show: 'fade',
        hide: 'fade',
        close: onClose
    });

    nhiro.notify.last = dialog;
    setTimeout(function(){
        dialog.dialog("close");
        setTimeout(function(){
            dialog.dialog("destroy");
        }, 1000);
    }, 1000 * seconds);
}
