/**
 * Fusen(Post-it) library (draggable box with text)
 * (c) 2013, Cybozu.
 */
goog.provide('nhiro.fusen');
goog.require('nhiro.adjust_text');
goog.require('nhiro.repos');

/**
 * @suppress {checkTypes}
 */
nhiro.fusen = (function() {
    var result = {};
    /** @suppress {checkTypes}
     * @param {*} r .
     * @param {*} onmove .
     * @param {*} onstart .
     * @param {*} onend .
     */
    function _add_drag_handler(r, onmove, onstart, onend) {
        r.drag(onmove, onstart, onend);
    }

    /** @suppress {checkTypes}
     * @param {*} paper .
     * @param {string} content .
     * @param {number} x .
     * @param {number} y .
     * @param {number} w .
     * @param {number} h .
     * @return {*} .
     */
    result.add = function(paper, content, x, y, w, h, attr) {
        var $ = nhiro.repos.get('jQuery');
        if (h == null) h = w / 1.618;
        if (attr == null) attr = {fill: '#fff'};
        var rect = paper.rect(x, y, w, h).attr(attr);
        var text = nhiro.adjust_text.add(paper, content, x, y, w, h);
        var r = paper.set([rect, text]);

        r.x = x;
        r.y = y;
        r.w = w;
        r.h = h;
        r.cx = r.x + r.w / 2;
        r.cy = r.y + r.h / 2;
        r.on_drag = function(dx, dy) {
            r.move(r.ox + dx, r.oy + dy);
        };
        r.on_drag_start = function() {
            r.ox = r.x;
            r.oy = r.y;
        };
        r.on_drag_end = function() {
        };
        _add_drag_handler(
            r,
            function(dx, dy) {r.on_drag(dx, dy)},
            function() {r.on_drag_start()},
            function() {r.on_drag_end()}
        );

        r.move = function(tx, ty) {
            r[0].attr({x: tx, y: ty});
            r[1].attr({x: r[1].attr('x') + tx - r.x,
                       y: r[1].attr('y') + ty - r.y});
            r.x = tx;
            r.y = ty;
            r.cx = r.x + r.w / 2;
            r.cy = r.y + r.h / 2;
        };

        r.update_text = function(content) {
            text.update_text(content);
        };

        r.set_align = function(type) {
            text.set_align(type);
        };
        return r;
    };

    return result;
})();
