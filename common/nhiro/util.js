/**
 * Misc Utilities
 * (c) 2013, Cybozu.
 */

goog.provide('nhiro.util');
/**
 */
nhiro.util = (function() {
    var util = {};
    /**
     * @param {Array.<Array.<*>>} xs .
     * @return {Array.<*>} .
     */
    function flatten(xs) {
        return xs.reduce(function(a, b) {return a.concat(b)});
    }
    util.flatten = flatten;
    return util;
})();

