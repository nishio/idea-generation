/**
 * (c) 2013, Cybozu.
 */
goog.provide('nhiro.assert');
goog.scope(function() {
    var _ = nhiro.assert;
    /**
     * @suppress {checkTypes}
     */
    _._show = function(opt_message) {
        if (window.console) {
            // show message
            window.console.log('Assertion Failure');
            if (opt_message) window.console.log('Message: ' + opt_message);
            // show stacktrace
            if (window.console.trace) window.console.trace();
            if (Error().stack) window.console.log(Error().stack);
        }
    }

    /**
     * @param {boolean} condition condition.
     * @param {string=} opt_message message.
     */
    _.assert = function(condition, opt_message) {
        if (!condition) {
            _._show(opt_message);
            // breakpoint
            if (nhiro.assert.to_break) debugger;
        }
    }
    _.to_break = true;
    /**
     * @param {string=} opt_message message.
     */
    nhiro.assert.not_here = function(opt_message) {
        _._show(opt_message);
        // breakpoint
        if (nhiro.assert.to_break) debugger;
    }

});
