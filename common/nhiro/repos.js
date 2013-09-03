/**
 * Supply pointers to third-party libraries.
 * (c) 2013, Cybozu.
 */
goog.provide('nhiro.repos');
goog.require('nhiro.assert');

/**
 */
nhiro.repos = (function() {
    var result = {};
    var repos = {};
    result.set = function(name, obj) {
        nhiro.assert.assert(obj != null);
        repos[name] = obj;
        return obj;
    }
    result.get = function(name) {
        var obj = repos[name];
        nhiro.assert.assert(obj != null);
        return obj;
    }
    return result;
})();

goog.exportSymbol('nhiro.repos', nhiro.repos);
