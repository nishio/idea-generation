/**
 * grouping
 * (c) 2013, Cybozu.
 */
goog.require('nhiro.util');
goog.provide('main.grouping');

// cached in calc_hull_and_cache
var hulls = [];

/** @typedef {{path: *, boxes: Array.<Box>}} */
var Group;

/** @type {Array.<Group>} */
main.grouping._groups = [];

/**
 * @param {Box} box .
 * @suppress {checkTypes}
 */
main.grouping.pushBox = function(box) {
    main.grouping._groups.push({
        path: main.paper.path('M0,0L0,0')
        .attr({'stroke-dasharray': '. '}),
        boxes: [box]});
    main.grouping.update_group_view();
};

/**
 * @param {number=} threshold .
 * @suppress {checkTypes}
 */
main.grouping.update_group_view = function(threshold) {
    var Raphael = nhiro.repos.get('Raphael');

    if (threshold == null) threshold = 1;
    var pathstr = '';
    for (var i = 0; i < main.grouping._groups.length; i++) {
        var path = main.grouping._groups[i].path;
        var boxes = main.grouping._groups[i].boxes;
        if (boxes.length > threshold) {
            var points = nhiro.util.flatten(boxes.map(get_four_corner));
            points = nhiro.convex_hull(points);
            pathstr = broaden(points);
        }else {
            pathstr = 'M0,0';
        }
        path.attr(
            'path',
            Raphael.parsePathString(pathstr));
    }
};

/**
 * @suppress {checkTypes}
 */
main.grouping.calc_hull_and_cache = function() {
    // calc convex hull and cache them
    hulls = [];
    for (var i = 0; i < main.grouping._groups.length; i++) {
        var boxes = main.grouping._groups[i].boxes;
        var points = nhiro.util.flatten(boxes.map(get_four_corner));
        var hull = nhiro.convex_hull(points);
        hulls.push(hull);
    }
};


/**
 * find group which collide with Box r
 * @param {Box} r .
 * @return {number} .
 * @suppress {checkTypes}
 */
function find_group(r) {
    var corners = get_four_corner(r);

    // first stage: is in convex hull?
    for (var i = 0; i < main.grouping._groups.length; i++) {
        var hull = hulls[i];
        for (var j = 0; j < 4; j++) {
            if (is_in_hull(corners[j], hull)) {
                return i;
            }
        }
    }

    var radius = 20;
    // second stage: if in raduis
    for (var i = 0; i < main.grouping._groups.length; i++) {
        var hull = hulls[i];
        var N = hull.length;
        for (var j = 0; j < N; j++) {
            var p = hull[j];
            var next = hull[(j + 1 + N) % N]; // cyclic access
            var v = next.sub(p);
            var nv = v.normalize();
            for (var k = 0; k < 4; k++) {
                var ckp = corners[k].sub(p);
                if (ckp.norm() < radius) {
                    return i;
                }
                var d = ckp.dot(nv);
                if (d < 0 || d > v.norm()) {
                    continue;
                }
                var indir = nv.rot90();
                d = -ckp.dot(indir);
                if (d < 0 || d > radius) {
                    continue;
                }
                return i;
            }
        }
    }
    return null;
}


/**
 * @param {Box} r .
 * @suppress {checkTypes}
 */
main.grouping.highlight_group = function(r) {
    main.grouping.reset_highlight();
    nearest_group = find_group(r);
    if (nearest_group != null) {
        _change_path_style(nearest_group, {'stroke-width': 5});
    }
};


/**
 * @suppress {checkTypes}
 */
function _change_path_style(id, style) {
    var path = main.grouping._groups[id].path;
    path.attr(style);
}

main.grouping.reset_highlight = function() {
    for (var i = 0; i < main.grouping._groups.length; i++) {
        _change_path_style(i, {'stroke-width': 1});
    }
};


/**
 * make groups solid-lined
 */
 main.grouping.make_solid = function() {
     for (var i = 0; i < main.grouping._groups.length; i++) {
        _change_path_style(i, {'stroke-dasharray': ''});
     }
 };


/**
 * make groups dotted-lined
 */
 main.grouping.make_dotted = function() {
     for (var i = 0; i < main.grouping._groups.length; i++) {
        _change_path_style(i, {'stroke-dasharray': '. '});
     }
 };

/**
 * create new group with a Box
 */
 main.grouping.create = function(r) {
     // create new group
     main.grouping._groups.push({
         path: main.paper.path('M0,0'),
         boxes: []});
     main.grouping.change_group(r, main.grouping._groups.length - 1);
 };

/**
 * @suppress {checkTypes}
 */
main.grouping.change_group = function(box, to) {
    for (var i = 0; i < main.grouping._groups.length; i++) {
        var g = main.grouping._groups[i];
        var boxes = g.boxes;
        g.boxes = boxes.filter(function(x) {return x !== box});
        if (g.boxes.length == 0) {
            g.path.attr('path', 'M0,0');
        }
    }
    main.grouping._groups[to].boxes.push(box);
    main.grouping._groups = main.grouping._groups.filter(function(x) {return x.boxes.length > 0});
};

