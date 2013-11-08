/**
 * (c) 2013, Cybozu.
 */
goog.provide('nhiro.assert');
goog.scope(function() {

    /**
     * @param {boolean} condition .
     * @param {string=} opt_message .
     * @param {boolean=} use_alert .
     */
    nhiro.assert = function(condition, opt_message, use_alert) {
        if (!condition) {
            _._show(opt_message, use_alert);
            // breakpoint
            if (nhiro.assert.to_break) debugger;
        }
    };

    var _ = nhiro.assert;
    //_.assert = nhiro.assert;

    /**
     * @suppress {checkTypes}
     * @param {string=} opt_message .
     * @param {boolean=} use_alert .
     */
    _._show = function(opt_message, use_alert) {
        if (window.console) {
            // show message
            window.console.log('Assertion Failure');
            if (opt_message) {
                window.console.log('Message: ' + opt_message);
                if (use_alert) {
                    window.alert(opt_message);
                }
            }

            // show stacktrace
            if (window.console.trace) window.console.trace();
            if (Error().stack) window.console.log(Error().stack);
        }
    };

    /**
     * When true, enter into debugger mode on assertion error.
     */
    _.to_break = true;

    /**
     * @param {string=} opt_message message.
     */
    nhiro.assert.not_here = function(opt_message) {
        _._show(opt_message);
        // breakpoint
        if (nhiro.assert.to_break) debugger;
    };

});
