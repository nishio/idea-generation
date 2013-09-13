/**
 * library to draw fukidashi (text in baloon)
 * (c) 2013, Cybozu.
 */

goog.provide('nhiro.fukidashi');
goog.require('nhiro.adjust_text');
goog.require('nhiro.fukidashi_path');

/**
 * @suppress {checkTypes}
 * @param {*} Raphael .
 * @param {*} paper .
 * @param {*} Backbone .
 * @param {*} unique_id ID to identfy images. Need for localstorage.
 * @return {*} fukidashi manager.
 */
 nhiro.fukidashi = function(Raphael, paper, Backbone, unique_id) {
    var result = {};
    var FUKIDASHI_STYLE = {
        'stroke': 'black', 'stroke-width': '3', 'fill': '#ffffcc'};
    var make_path = nhiro.fukidashi_path;

    // adapter to Raphael
    function empty() {
        var path = paper.path(nhiro.path.EMPTY_STR);
        path.attr(FUKIDASHI_STYLE);
        return path;
    }
    result.empty = empty;

    function create(x, y, width, height, px, py) {
        var path = make_path(x, y, width, height, px, py);
        path = paper.path(path.to_str());
        path.attr(FUKIDASHI_STYLE);
        return path;
    }
    result.create = create;

    function update(path, x, y, width, height, px, py) {
        var pathstr = make_path(x, y, width, height, px, py).to_str();
        path.attr('path', Raphael.parsePathString(pathstr));
    }
    result.update = update;

    function reset(path) {
        var pathstr = nhiro.path.EMPTY_STR;
        path.attr('path', Raphael.parsePathString(pathstr));
        return path;
    }
    result.reset = reset;

    // Backbone Model, Collection and View
    var FukidashiModel = Backbone.Model.extend({});
    result.FukidashiModel = FukidashiModel;

    var FukidashiCollection = Backbone.Collection.extend({
        model: FukidashiModel,
        localStorage: new Backbone.LocalStorage('annobar_fukidashi' + unique_id)
    });
    result.Collection = FukidashiCollection;

    var FukidashiView = Backbone.View.extend({
        /**
         * @this {*} .
         */
        initialize: function() {
            this.model.bind('destroy', this.remove, this);
        },

        /**
         * @this {*} .
         */
        render: function() {
            var x = this.model.get('x');
            var y = this.model.get('y');
            var width = this.model.get('width');
            var height = this.model.get('height');
            var px = this.model.get('px');
            var py = this.model.get('py');
            this.path = result.create(x, y, width, height, px, py);
            var text = this.model.get('text');
            //this.text = paper.text(x, y, text);
            this.text = nhiro.adjust_text.add(paper, text, x, y, width, height);
        },

        /**
         * @this {*} .
         */
        remove: function() {
            this.text.remove();
            this.path.remove();
        }
    });
    result.View = FukidashiView;

    return result;
};
