/**
 * (c) 2013, Cybozu.
 * Growl-like notification.
 * Require: jQuery, jQuery UI Dialog
 */
goog.provide('nhiro.notify');

/**
 * @param {string} message .
 * @param {number=} seconds .
 * @suppress {checkTypes}
 */
nhiro.notify = function(message, seconds) {
    var $ = nhiro.repos.get('jQuery');
    var box = $('<div>');
    if (seconds == null) seconds = 10;

    box.text(message);
    box.appendTo('body');
    var position, onClose;
    if (nhiro.notify.top_filled) {
        position = {my: 'right top', at: 'right bottom', of: nhiro.notify.last};
        onClose = function() {};
    }else {
        position = {my: 'right top', at: 'right top', of: $('body')};
        nhiro.notify.top_filled = true;
        onClose = function() {
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
    setTimeout(function() {
        dialog.dialog('close');
        setTimeout(function() {
            dialog.dialog('destroy');
        }, 1000);
        box.remove();
    }, 1000 * seconds);
};


/**
 * @type {!Object}
 */
nhiro.notify.shown = {};

/**
 * @param {string} message .
 * @param {number=} seconds .
 */
nhiro.notify.once = function(message, seconds) {
    if (nhiro.notify.shown[message] == null) {
        nhiro.notify.shown[message] = true;
        nhiro.notify(message, seconds);
    }
};

/**
 * @type {boolean}
 */
nhiro.notify.top_filled = false;

/**
 * @type {Object}
 */
nhiro.notify.last = null;
