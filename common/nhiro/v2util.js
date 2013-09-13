/**
 * utility for 2-dim vector
 * (c) 2013, Cybozu.
 */
goog.require('nhiro.V2');
goog.require('nhiro.assert');
goog.provide('nhiro.v2util');

nhiro.v2util = (function() {
    /** find crosspoint with horizontal line */
    function crosspoint_horizontal(start, dir, y) {
        DEBUG && nhiro.assert(dir.y != 0, 'dir.y == 0. no crosspoint.');
        var igrad = dir.x / dir.y;
        var new_x = start.x + (y - start.y) * igrad;
        return nhiro.V2.make(new_x, y);
    }
    nhiro.v2util.crosspoint_horizontal = crosspoint_horizontal;

    /** find crosspoint with vertical line */
    function crosspoint_vertical(start, dir, x) {
        DEBUG && nhiro.assert(dir.x != 0, 'dir.x == 0. no crosspoint.');
        var grad = dir.y / dir.x;
        var new_y = start.y + (x - start.x) * grad;
        return nhiro.V2.make(x, new_y);
    }
    nhiro.v2util.crosspoint_vertical = crosspoint_vertical;

    /** find crosspoint with rect,
     *  means the nearest crosspoint with horizontal and vertical lines */
    function crosspoint_rect(start, dir, rect) {
        nhiro.assert(rect.w > 0);
        nhiro.assert(rect.h > 0);
        // find four crosspoint
        var top = crosspoint_horizontal(start, dir, rect.y);
        var bottom = crosspoint_horizontal(start, dir, rect.y + rect.h);
        var left = crosspoint_vertical(start, dir, rect.x);
        var right = crosspoint_vertical(start, dir, rect.x + rect.w);

        // ignore if out-bound
        if (top.x < rect.x || top.x > rect.x + rect.w) {
            top = null;
        }
        if (bottom.x < rect.x || bottom.x > rect.x + rect.w) {
            bottom = null;
        }
        if (left.y < rect.y || left.y > rect.y + rect.h) {
            left = null;
        }
        if (right.y < rect.y || right.y > rect.y + rect.h) {
            right = null;
        }

        // return nearest one
        var result;
        function near(v1, v2) {
            return v1.sub(start).norm() < v2.sub(start).norm();
        }
        if (bottom != null) {
            result = bottom;
            result.where = 'bottom';
            result.horizontal = true;
        }
        if (top != null) {
            if (result == null || near(top, result)) {
                result = top;
                result.where = 'top';
                result.horizontal = true;
            }
        }
        if (right != null) {
            if (result == null || near(right, result)) {
                result = right;
                result.where = 'right';
                result.horizontal = false;
            }
        }
        if (left != null) {
            if (result == null || near(left, result)) {
                result = left;
                result.where = 'left';
                result.horizontal = false;
            }
        }
        return result;
    }
    function test_crosspoint_rect() {
        var V = nhiro.V2.make;
        var r;
        r = crosspoint_rect(V(0, -100), V(1, 2), {x: 0, y: 0, w: 100, h: 100});
        nhiro.assert(r.x == 50);
        nhiro.assert(r.y == 0);
        nhiro.assert(r.where == 'bottom');
    }
    nhiro.v2util.crosspoint_rect = crosspoint_rect;

    function is_inside(p, rect) {
        if (rect.x < p.x && p.x < rect.x + rect.w) {
            if (rect.y < p.y && p.y < rect.y + rect.h) {
                return true;
            }
        }
        return false;
    }
    nhiro.v2util.is_inside = is_inside;
    return nhiro.v2util;
})();
