/**
 * Utilities for SVG Path.
 * (c) 2013, Cybozu.
 */
goog.provide('nhiro.path');
goog.require('nhiro.V2');
/**
 * library to construct path string
 * USAGE:
 * var path = new nhiro.path();
 * var V = nhiro.V2.make;
 * path.move_to(V(x, y) + V(width, height).scale(0.5))
 * path.line_to(V(px, py));
 * paper.path(path.to_str());
 * (paper.path is Raphael's method to create path object)
 */
nhiro.path = function() {
    /**
     * @constructor
     */
    function path() {
        this.items = [];
    }
    var p = path.prototype;

    path.EMPTY_STR = p.EMPTY_STR = 'M0,0';

    /**
     * @this {path}
     * @return {string} .
     */
    p.to_str = function() {
        if (this.items.length == 0) {
            return p.EMPTY_STR;
        }else {
            return this.items.join(' ');
        }
    }

    /**
     * @param {has_xy|number} p .
     * @param {number=} y .
     * @this {path}
     * @return {?path} .
     */
    p.line_to = function(p, y) {
        if (y != null) {
            p = new nhiro.V2.make(p, y);
        }else {
            p = new nhiro.V2(p);
        }
        this.items.push('L ' + p.to_str());
        return this;
    }


    /**
     * CCW circle arc
     * @param {number} radius .
     * @param {nhiro.V2} endpoint .
     * @this {path}
     * @return {?path} .
     */
    p.circle_arc_to = function(radius, endpoint) {
        this.items.push(
            'A' + radius + ',' + radius +
                ',0,0,0,' + endpoint.to_str());
        return this;
    }


    /**
     * @param {has_xy|number} p .
     * @param {number=} y .
     * @this {path}
     * @return {?path} .
     */
    p.move_to = function(p, y) {
        if (y != null) {
            p = new nhiro.V2.make(p, y);
        }else {
            p = new nhiro.V2(p);
        }
        this.items.push('M ' + p.to_str());
        return this;
    }

    /**
     * @return {path} .
     * @this {path}
     */
    p.close = function() {
        this.items.push('Z');
        return this;
    }

    return path;
}();
