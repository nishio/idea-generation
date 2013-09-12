/**
 * box-arrow
 * (c) 2013, Cybozu.
 */
goog.require('main.gdcon');
goog.require('main.grouping');
goog.require('nhiro.V2');
goog.require('nhiro.assert');
goog.require('nhiro.convex_hull');
goog.require('nhiro.fusen');
goog.require('nhiro.path');
goog.require('nhiro.stateman');
goog.require('nhiro.util');

goog.provide('main.main');

var circles = [];
var temp_line;
var lines = [];
var first_box = null;
//var mode = 'move';
var line_style = 'single_tip';

var nearest_group = null;


/** @typedef {*} */
var Box;

/** @type {Array.<Box>} */
main.boxes = [];

 /** @typedef {*} */
var Paper;

/** @type {Paper} */
main.paper;


/**
 * @param {has_xywh} box .
 * @return {Array.<nhiro.V2>} .
 */
function get_four_corner(box) {
    var V = nhiro.V2.make;
    return [
        V(box.x, box.y),
        V(box.x + box.w, box.y),
        V(box.x + box.w, box.y + box.h),
        V(box.x, box.y + box.h)
    ];
}

/**
 * broaden CCW points sequence
 * @param {Array.<nhiro.V2>} points .
 * @return {string} path string.
 */
function broaden(points) {
    var radius = 20; // future work: change by each point
    var N = points.length;
    if (N == 0) { return 'M0,0'; }
    var starts = [];
    var ends = [];
    var outdirs = [];
    function get(xs, i) { // cyclic access
        var N = xs.length;
        return xs[(i + N) % N];
    }
    for (var i = 0; i < N; i++) {
        var outdir = points[i].sub(get(points, i + 1)).rot90().normalize();
        outdirs.push(outdir);
    }
    for (var i = 0; i < N; i++) {
        var v = outdirs[i].scale(radius);
        starts.push(v.add(points[i]));
        v = get(outdirs, i - 1).scale(radius);
        ends.push(v.add(points[i]));
    }

    var path = (new nhiro.path()
                .move_to(ends[0])
                .circle_arc_to(radius, starts[0]));
    for (var i = 1; i < N; i++) {
        path.line_to(ends[i]).circle_arc_to(radius, starts[i]);
    }
    return path.close().to_str();
}

/**
 * @param {number} norm .
 * @param {number} angle .
 * @return {nhiro.V2} .
 */
 function angled_vec(norm, angle) {
    return nhiro.V2.make(norm * Math.cos(angle),
                         norm * Math.sin(angle));
}

/**
 * @param {has_xy} box1 .
 * @param {has_xy} box2 .
 * @param {string} style .
 * @return {string} .
 */
function makeArrow(box1, box2, style) {
    box1 = new nhiro.V2(box1);
    box2 = new nhiro.V2(box2);
    var path = new nhiro.path();
    var headlen = 8;   // length of head in pixels
    var fromx = box1.x;
    var fromy = box1.y;
    var tox = box2.x;
    var toy = box2.y;
    var angle = Math.atan2(toy - fromy, tox - fromx);
    var upangle = angle + Math.PI / 6;
    var downangle = angle - Math.PI / 6;
    if (style == 'no_tip') {
        path.move_to(box1).line_to(box2);
    }else if (style == 'single_tip') {
        path.move_to(box1).line_to(box2);
        path.line_to(box2.sub(angled_vec(headlen, downangle)));
        path.move_to(box2);
        path.line_to(box2.sub(angled_vec(headlen, upangle)));
    } else if (style == 'double_tip') {
        path.move_to(box1);
        path.line_to(box2);
        path.line_to(box2.sub(angled_vec(headlen, downangle)));
        path.move_to(box2);
        path.line_to(box2.sub(angled_vec(headlen, upangle)));
        path.move_to(box1);
        path.line_to(box1.add(angled_vec(headlen, downangle)));
        path.move_to(box1);
        path.line_to(box1.add(angled_vec(headlen, upangle)));
    }
    return path.to_str();
}

/**
 * @param {number} x .
 * @return {number} x .
 */
function sgn(x) {
    if (x > 0) return 1;
    if (x < 0) return -1;
    return 0;
}


/**
 * @param {has_xywh} rect .
 * @return {nhiro.V2} .
 */
function get_center(rect) {
    return (
        nhiro.V2.make(rect.w, rect.h)
        .scale(0.5).add(rect));
}


/**
 * @param {{x: number, y: number, w: number, h: number}} box1 .
 * @param {{x: number, y: number, w: number, h: number}} box2 .
 * @param {number} box .
 * @param {number?} distant .
 * @return {{x: number, y: number, c: string}}
 */
function findBoxEdge(box1, box2, box, distant) {
    var center1 = get_center(box1);
    var center2 = get_center(box2);
    var w, h, s, c, e, ox, oy, d;
    var v2 = nhiro.V2.make;
    var center, center_other;
    if (box == 1) {
        w = box1.w / 2;
        h = box1.h / 2;
        center = center1;
        center_other = center2;
    } else {
        w = box2.w / 2;
        h = box2.h / 2;
        center = center2;
        center_other = center1;
    }

    var delta;
    delta = center_other.sub(center);
    w += 5;
    h += 5;
    var grad = delta.y / delta.x;
    var igrad = delta.x / delta.y;
    var sign_dx = sgn(delta.x);
    var sign_dy = sgn(delta.y);
    //intersection is on the top or bottom
    if (w * Math.abs(delta.y) > h * Math.abs(delta.x)) {
        if (delta.y > 0) {
            s = v2(h * igrad, h);
            c = 'top';
        }
        else {
            s = v2(-h * igrad, -h);
            c = 'bottom';
        }
    }
    else {
        //intersection is on the left or right
        if (delta.x > 0) {
            s = v2(w, w * grad);
            c = 'right';
        }
        else {
            s = v2(-w, -grad * w);
            c = 'left';
        }
    }
    if (distant == null) return center.add(s);
    //for 2 paralel distant of 2e
    e = distant;
    if (delta.y == 0) {
        ox = 0;
    }else {
        ox = e * Math.sqrt(1 + Math.pow(igrad, 2));
    }
    if (delta.x == 0) {
        oy = 0;
    }else {
        oy = e * Math.sqrt(1 + Math.pow(grad, 2));
    }

    if (delta.y != 0 && Math.abs(ox + h * igrad) <= w) {
        d = v2(sign_dy * (ox + h * igrad),
               sign_dy * h);
    }else if (Math.abs(-1 * oy + w * grad) <= h) {
        d = v2(sign_dx * w,
               sign_dx * (-1 * oy + w * grad));
    }
    if (delta.y != 0 &&
        Math.abs(-1 * ox + h * igrad) <= w) {
        d = v2(sign_dy * (-1 * ox + h * igrad),
               sign_dy * h);
    }
    else if (Math.abs(oy + w * grad) <= h) {
        d = v2(sign_dx * w,
               sign_dx * (oy + w * grad));
    }
    return center.add(d);
}

/**
 * @param {has_xywh} box1 box1.
 * @param {has_xywh} box2 box2.
 * @param {number} style style.
 * @return {string} .
 */
function line2path(box1, box2, style) {
    /* switch case for line_style should be here */
    var e1, e2;
    var result = '';
    if (style == 'single_tip') {
        e1 = findBoxEdge(box1, box2, 1, null);
        e2 = findBoxEdge(box1, box2, 2, null);
        result = makeArrow(e1, e2, 'single_tip');
    }else if (style == 'double_tip') {
        e1 = findBoxEdge(box1, box2, 1, null);
        e2 = findBoxEdge(box1, box2, 2, null);
        result = makeArrow(e1, e2, 'double_tip');
    }else if (style == 'double_arrow') {
        e1 = findBoxEdge(box1, box2, 1, 10);
        e2 = findBoxEdge(box1, box2, 2, -10);
        result = makeArrow(e1, e2, 'single_tip');
        e1 = findBoxEdge(box2, box1, 1, 10);
        e2 = findBoxEdge(box2, box1, 2, -10);
        result += makeArrow(e1, e2, 'single_tip');
    }else if (style == 'double_line') {
        e1 = findBoxEdge(box1, box2, 1, 10);
        e2 = findBoxEdge(box1, box2, 2, -10);
        result = makeArrow(e1, e2, 'no_tip');
        e1 = findBoxEdge(box2, box1, 1, 10);
        e2 = findBoxEdge(box2, box1, 2, -10);
        result += makeArrow(e1, e2, 'no_tip');
    }else if (style == 'dashed_line') {
        e1 = findBoxEdge(box1, box2, 1, null);
        e2 = findBoxEdge(box1, box2, 2, null);
        result += makeArrow(e1, e2, 'no_tip');
    }else {
        nhiro.assert.not_here();
    }
    return result;
}


/**
 * @param {number} style style.
 * @return {Object} .
 */
function style2attr(style) {
    if (style == 'dashed_line') {
        return {'stroke-dasharray': '-'};
    }
    return {};
}

/**
 * Add fusen and add event handlers on it.
 * @suppress {checkTypes}
 */
main.add_fusen = function(text, x, y) {
    var r = nhiro.fusen.add(
        main.paper, text, x, y, 130, null,
        {'fill': '#ffc', 'fill-opacity': 0.8,
         'stroke': '#aaa', 'stroke-width': 0.3, 'stroke-opacity': 0.9});
    r.id = main.boxes.length;

    r.selected = false;
    r.select = function() {
        r[0].attr({stroke: 'blue', 'stroke-width': 2});
        r.selected = true;
    };
    r.unselect = function() {
        r[0].attr({stroke: '#000', 'stroke-width': 1});
        r.selected = false;
    };
    r.original_move = r.move;
    r.move = function(tx, ty) {
        nhiro.stateman.trigger('box', 'move', null, [r, tx, ty]);
        return this;
    };
    r.on_drag_start = function() {
        r.ox = r.x;
        r.oy = r.y;
        nhiro.stateman.trigger('box', 'drag_start', null, [r]);
    };
    r.on_drag_end = function() {
        nhiro.stateman.trigger('box', 'drag_end', null, [r]);
    };

    r.mouseover(function() {
        r.toFront();
    });

    r.mousedown(function() {
        nhiro.stateman.trigger('box', 'mousedown', null, [r]);
    });
    main.boxes.push(r);
    main.grouping.pushBox(r);

    main.disable_if_less_than_two_boxes();
    return r;
};

/**
 * If there are less than 2 boxes, disable 'draw line' option, v.v.
 * @suppress {checkTypes}
 */
main.disable_if_less_than_two_boxes = function() {
    var $ = nhiro.repos.get('jQuery');
    if (main.boxes.length > 1) {
        $('.line').removeAttr('disabled');
    } else {
        $('.line').attr('disabled', 'disabled');
    }
};



/**
 * @suppress {checkTypes}
 */
main.reset_temp_line = function() {
    var Raphael = nhiro.repos.get('Raphael');
    temp_line.attr('path', Raphael.parsePathString('M0,0L0,0'));
    if (first_box != null) {
        first_box.unselect();
        first_box = null;
    }
};


/**
 * @suppress {checkTypes}
 */
function move_lines(r) {
    var $ = nhiro.repos.get('jQuery');
    var Raphael = nhiro.repos.get('Raphael');
    $(lines).each(function() {
        var box1 = null, box2 = null, e1, e2;
        if (this.box1.id == r.id) {
            box1 = r;
            box2 = this.box2;
        } else if (this.box2.id == r.id) {
            box1 = this.box1;
            box2 = r;
        }
        if (box1 != null && box2 != null) {
            var pathstr = line2path(box1, box2, this.style);
            pathstr = Raphael.parsePathString(pathstr);
            this.attr('path', pathstr);
        }
    });
}


/**
 * @suppress {checkTypes}
 */
function add_box(content) {
    var $ = nhiro.repos.get('jQuery');
    if (content === undefined) {
        content = $('.text').val();
        $('.text').val('');
    }
    if (content == '') return;

    var id = main.boxes.length;
    var when = new Date().toISOString();
    main.gdcon.pushObj({
        'text': content,
        'when': when,
        'id': id});

    return main.add_fusen(content, 100, 100);
}


/**
 * return if *point* is in given convex hull.
 * @param {nhiro.V2} point .
 * @param {Array.<nhiro.V2>} hull .
 * @return {boolean} .
 */
function is_in_hull(point, hull) {
    var N = hull.length;
    function get(hull, i) { // cyclic access
        return hull[(i + N) % N];
    }
    for (var i = 0; i < N; i++) {
        var p = hull[i];
        var next = get(hull, i + 1);
        var outdir = p.sub(next).rot90().normalize();
        if (point.sub(p).dot(outdir) > 0) {
            return false;
        }
    }
    return true;
}

/**
 * @param {*} box1 box1.
 * @param {*} box2 box2.
 * @param {number} style style.
 * @param {Array.<number>} distant distant.
 * @param {Object=} attr attr.
 * @suppress {checkTypes}
 */
function add_line(box1, box2, style, distant, attr) {
    var pathstr = line2path(box1, box2, style);
    var line = (main.paper.path(pathstr)
                .attr({stroke: '#000', 'stroke-width': 2}));
    line.attr(style2attr(style));

    line.toBack();
    line.box1 = box1;
    line.box2 = box2;
    line.style = style;
    line.distant = distant;

    lines.push(line);
}


/**
 * @suppress {checkTypes}
 */
main.setup_event_handling = function() {
    var $ = nhiro.repos.get('jQuery');
    var Raphael = nhiro.repos.get('Raphael');

    var stateman = nhiro.stateman;
    stateman.make_empty_state('move');
    stateman.make_empty_state('line');
    stateman.make_empty_state('group');
    stateman.go('move');

    stateman.add_enter('group', function() {
        main.grouping.make_solid();
        main.grouping.update_group_view(0);
    });

    stateman.add_exit('group', function() {
        main.grouping.make_dotted();
        main.grouping.update_group_view(1);
    });

    stateman.add_handler('move', 'box', 'move', function(r, tx, ty) {
        r.original_move(tx, ty);
        move_lines(r);
        main.grouping.update_group_view();
    });

    stateman.add_handler('move', 'box', 'drag_end', function(r) {
        main.gdcon.updateItem(r);
    });

    stateman.add_handler('group', 'box', 'move', function(r, tx, ty) {
        r.original_move(tx, ty);
        move_lines(r);
        main.grouping.highlight_group(r);
    });

    stateman.add_handler('line', 'box', 'mousedown', function(r) {
        if (first_box != null) {
            add_line(first_box, r, line_style);
            main.reset_temp_line();
        } else {
            $(main.boxes.children).each(function() { r.unselect(); });
            first_box = r;
            r.select();
        }
    });

    var offset = $('#canvas').offset();
    stateman.add_handler('line', 'canvas', 'mousemove', function(e) {
        if (first_box != null) {
            var path = new nhiro.path();
            path.move_to(get_center(first_box));
            path.line_to({x: e.pageX - offset.left,
                          y: e.pageY - offset.top});
            temp_line.attr('path', Raphael.parsePathString(path.to_str()));
        }
    });

    stateman.add_exit('line', main.reset_temp_line);
    stateman.add_handler('group', 'box', 'drag_start', function(r) {
        main.grouping.calc_hull_and_cache();
    });
    stateman.add_handler('group', 'box', 'drag_end', function(r) {
        if (nearest_group == null) {
            main.grouping.create(r);
            main.grouping.update_group_view(0);
        }else {
            main.grouping.change_group(r, nearest_group);
            main.grouping.update_group_view(0);
        }
        main.grouping.calc_hull_and_cache();
        main.grouping.reset_highlight();
    });

    $('#canvas').mousemove(function(e) {
        stateman.trigger('canvas', 'mousemove', null, [e]);
    });

    $('.text').keypress(function(e) {
        if (e.keyCode == 13) add_box();
        $('.move').click();
    });

    $('#multitext_submit').click(function(e) {
        var items = $('#multitext').val().split(/\n\s*/g);
        items.forEach(function(x) {
            var b = add_box(x);
            var pos = main.find_space(b.id);
            b.move(pos);
            main.gdcon.updateItem(b);
        });
        $('#multitext').val('');
        $('.move').click();
    });

    $('body').keydown(function(e) {
        if (e.keyCode == 27) { // ESC
            main.reset_temp_line();
        }
    });

    // add handler to change mode
    $('input[name=mode]').click(function(e) {
        stateman.go(e.target.value);
    });

    // add handler to change line style
    $('input[name=style]').click(function(e) {
        stateman.go('line');
        $('#mode_line').attr('checked', true);
        line_style = $('input[name=style]:checked').val();
    });

    // when #go_menu clicked, scroll to menu
    $('#go_menu').click(function(){
        console.log('scroll');
        $('body').animate({
            scrollTop: $('#menu').offset().top
        }, 100);
        return false;
    });

    // when #go_menu clicked, scroll to top
    $('#go_canvas').click(function(){
        console.log('scroll');
        $('body').animate({
            scrollTop: 0
        }, 100);
        return false;
    });

};

/**
 * find space to put a card
 */
main.find_space = function(i) {
    var b = nhiro.V2.make(
        131 * (i % 11),
        81 * (Math.floor(i / 11) % 10)
    );
    return b;
};

function t() {
    main.boxes.forEach(function(b, i) {
        var pos = main.find_space(i);
        b.move(pos.x, pos.y);
        main.gdcon.updateItem(b);
    });
}

/**
 * @suppress {checkTypes}
 */
main.main = function() {
    var $ = nhiro.repos.get('jQuery');
    var Raphael = nhiro.repos.get('Raphael');
    main.setup_event_handling();

    // make Raphael paper
    var w = $('#canvas').width();
    var h = $('#canvas').height();
    main.paper = Raphael($('#canvas')[0], w, h);

    // create templine
    temp_line = (
        main.paper.path('M0,0L0,0')
        .attr({stroke: '#000', 'stroke-width': 2}));

    // start connection to Google Drive
    main.gdcon.startRealtime();

    main.grouping.update_group_view();
};

