/**
 * Adjustable textbox
 * depends: jQuery, Raphael(paper)
 * (c) 2013, Cybozu.
 */
goog.provide('nhiro.adjust_text');
goog.require('nhiro.repos');
/**
 * @suppress {checkTypes}
 */
nhiro.adjust_text = (function() {
    var result = {};
    var FONT_SIZE = 36;
    /**
     * @param {string} s .
     * @param {number} n .
     * @return {Array.<string>} .
     */
    function split_str(s, n) {
        var len = s.length;
        var m = Math.ceil(len / n);
        var result = [];
        var t = '';
        for (var i = 0; i < len; i++) {
            t += s[i];
            if (t.length == m) {
                result.push(t);
                t = '';
            }
        }
        if (t != '') {
            result.push(t);
        }
        return result;
    }

    /**
     * get width and height of given text
     * @param {string} content .
     * @return {{x: number, y: number}} .
     * @suppress {checkTypes}
     */
    function get_content_extent(content) {
        var $ = nhiro.repos.get('jQuery');
        var t = content.replace('\n', '<br/>');
        var a = (
            $('<span>' + t + '</span>')
            .css('font-family', 'arial')
            .css('font-size', FONT_SIZE + 'px')
            .css('display', 'none')
            .appendTo('body'));
        var r = {x: a.width(), y: a.height()};
        a.remove();
        return r;
    }

    /**
     * choose nice font-size to fit in given box
     * @param {string} content .
     * @param {number} w .
     * @param {number} h .
     * @return {{scale: number, n_split: number}} .
     */
    function fit_in(content, w, h) {
        var size = get_content_extent(content);
        var max_scale = Math.min(w / size.x, h / size.y);
        var n_split = 2;
        while (true) {
            var s = split_str(content, n_split).join('<br/>');
            size = get_content_extent(s);
            var scale = Math.min(w / size.x, h / size.y);
            if (scale <= max_scale) {
                return {scale: max_scale,
                        font_size: FONT_SIZE * max_scale,
                        n_split: n_split - 1};
            }
            max_scale = scale;
            n_split++;
        }
    }
    result.fit_in = fit_in;

    /**
     * @suppress {checkTypes}
     */
    result.add = function(jQuery, paper, content, x, y, w, h) {
        var text = (paper.text(x + w / 2, y + h / 2, '')
                 .attr({fill: '#000'}));
        var align = 'center';

        function _calc_text_pos(p) {
            var s;
            if (align == 'left') {
                s = 0;
            }else if (align == 'right') {
                s = 1;
            }else {
                s = 0.5;
            }
            return {x: x + w * s,
                    y: y + h * 0.5};
        }

        text.update_text = function(content) {
            var adjust = fit_in(content, w, h);
            content = split_str(content, adjust.n_split).join('\n');
            var font = adjust.font_size;
            text.attr('text', content)
            .attr('font', font + 'px arial');
        }

        text.set_align = function(type) {
            align = type;
            if (type == 'left') {
                text.attr('text-anchor', 'start');
            }else if (type == 'right') {
                text.attr('text-anchor', 'end');
            }else {
                text.attr('text-anchor', 'middle');
            }
            text.attr(_calc_text_pos(text));
        }

        text.update_text(content);
        return text;
    }

    return result;
})();
