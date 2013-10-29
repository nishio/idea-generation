/**
 * (c) 2013, Cybozu.
 * small logging library
 */
goog.provide('nhiro.log');
/**
 * @param {string} msg .
 * @suppress {checkTypes}
 */
nhiro.log = function(msg) {
    window.console.log(msg);
};
