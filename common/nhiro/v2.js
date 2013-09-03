/**
 * library to handle 2-dim vector
 *
 * I know goog has goog.Vec2,
 * but I hate to use vec[0] as vec.x, it's confusing.
 *
 * (c) 2013, Cybozu.
 */
goog.require('nhiro.assert');
goog.provide('nhiro.V2');

nhiro.V2 = function() {
    /**
     * @constructor
     * @param {{x: number, y: number}} pos .
     */
    function V2(pos) {
        nhiro.assert.assert(!isNaN(pos.x));
        nhiro.assert.assert(!isNaN(pos.y));
        this.x = pos.x;
        this.y = pos.y;
    }
    var p = V2.prototype;

    /**
     * @param {number} x .
     * @param {number} y .
     * @return {V2} .
     */
    p.make = V2.make = function(x, y) {
        return new V2({x: x, y: y});
    };

    /**
     * @this {V2}
     * @return {V2} .
     */
    p.clone = function() {
        return new V2(this);
    };
    /**
     * @this {V2}
     * @param {V2|{x: number, y: number}} rhs .
     * @return {V2} .
     */
    p.add = function(rhs) {
        return p.make(
            this.x + rhs.x,
            this.y + rhs.y);
    };

    /**
     * @this {V2}
     * @param {V2|{x: number, y: number}} rhs .
     * @return {V2} .
     */
    p.sub = function(rhs) {
        return p.make(
            this.x - rhs.x,
            this.y - rhs.y);
    };


    /**
     * @this {V2}
     * @param {V2|{x: number, y: number}} rhs .
     * @return {number} .
     */
    p.outer = function(rhs) {
        return this.x * rhs.y - rhs.x * this.y;
    }


    /**
     * @this {V2}
     * @param {V2|{x: number, y: number}} rhs .
     * @return {number} .
     */
    p.dot = function(rhs) {
        return this.x * rhs.x + this.y * rhs.y;
    }


    function is_number(x) {
        return typeof(x) == 'number';
    }

    /**
     * @this {V2}
     * @return {string} .
     */
    p.to_str = function() {
        nhiro.assert.assert(is_number(this.x) && is_number(this.y));
        return this.x + ', ' + this.y;
    }

    /**
     * @this {V2}
     * @return {V2} .
     */
    p.rot90 = function() {
        return p.make(this.y, -this.x);
    }


    /**
     * @this {V2}
     * @param {number} s .
     * @return {V2} .
     */
    p.scale = function(s) {
        return p.make(this.x * s, this.y * s);
    }

    /**
     * @this {V2}
     * @return {number} .
     */
    p.norm = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * @this {V2}
     * @return {V2} .
     */
    p.normalize = function() {
        return this.scale(1 / this.norm());
    }

    /**
     * rotate vector clockwise.
     * @param {number} theta angle to rorate (radian).
     * @this {V2}
     * @return {V2} .
     */
    p.rotate = function(theta) {
        var s = Math.sin(theta);
        var c = Math.cos(theta);
        return p.make(
            this.x * c - this.y * s,
            this.x * s + this.y * c
        );
    }
    return V2;
}();

goog.exportSymbol('nhiro.V2', nhiro.V2);
