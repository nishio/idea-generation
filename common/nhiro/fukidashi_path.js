/**
 * Draw paths of fukidashi(text in baloon)
 * (c) 2013, Cybozu.
 */
goog.provide('nhiro.fukidashi_path');
goog.require('nhiro.path');
/**
 * calculate fukidashi path
 * @param {number} x left of box.
 * @param {number} y  top of box.
 * @param {number} width .
 * @param {number} height .
 * @param {number} px tip point of horn.
 * @param {number} py top point of horn.
 * @return {nhiro.path} .
 */
nhiro.fukidashi_path = function(x, y, width, height, px, py) {
    var path = new nhiro.path();
    var RADIUS = 10;
    var V = nhiro.V2.make;
    var p;
    if (px != null && py != null) {
        p = V(px, py);
    }
    var bottom = y + height;
    var bottomR = bottom + RADIUS;
    var right = x + width;
    var rightR = right + RADIUS;
    var points = [
        [V(x, bottomR),
         V(right, bottomR)], // bottom
        [V(rightR, bottom),
         V(rightR, y)], // right
        [V(right, y - RADIUS),
         V(x, y - RADIUS)], // top
        [V(x - RADIUS, y),
         V(x - RADIUS, bottom)] // left
    ];

    var cp1, cp2;
    var rect = {
        x: x - RADIUS, y: y - RADIUS,
        w: width + 2 * RADIUS, h: height + 2 * RADIUS};
    if (p != null && !nhiro.v2util.is_inside(p, rect)) {
        var center = V(x + width / 2, y + height / 2);
        var dir = center.sub(p);

        function dummy(which) {
            var cp;
            // dir doesn't cross to the rect
            if (width * Math.abs(dir.y) > height * Math.abs(dir.x)) {
                if (dir.y > 0) {
                    cp = points[2][which].clone();
                    cp.where = 'top';
                }else {
                    cp = points[0][which].clone();
                    cp.where = 'bottom';
                }
                cp.horizontal = true;
            }else {
                if (dir.x > 0) {
                    cp = points[3][which].clone();
                    cp.where = 'left';
                }else {
                    cp = points[1][which].clone();
                    cp.where = 'right';
                }
                cp.horizontal = false;
            }
            return cp;
        }

        function round(cp) {
            if (cp.horizontal) {
                if (cp.x < x) cp.x = x;
                if (cp.x > right) cp.x = right;
            }else {
                if (cp.y < y) cp.y = y;
                if (cp.y > bottom) cp.y = bottom;
            }
        }

        var d;
        var ANGLE = 3.14 / 10;
        d = dir.rotate(ANGLE);
        cp1 = nhiro.v2util.crosspoint_rect(p, d, rect);
        if (cp1 == null) {
            cp1 = dummy(1);
        }else {
            round(cp1);
        }

        d = dir.rotate(-ANGLE);
        cp2 = nhiro.v2util.crosspoint_rect(p, d, rect);
        if (cp2 == null) {
            cp2 = dummy(0);
        }else {
            round(cp2);
        }

        var commands = [
            'bottom',
            function() {path.line_to(points[0][1])},
            function() {path.circle_arc_to(RADIUS, points[1][0])},
            'right',
            function() {path.line_to(points[1][1])},
            function() {path.circle_arc_to(RADIUS, points[2][0])},
            'top',
            function() {path.line_to(points[2][1])},
            function() {path.circle_arc_to(RADIUS, points[3][0])},
            'left',
            function() {path.line_to(points[3][1])},
            function() {path.circle_arc_to(RADIUS, points[0][0])}
        ];
        path.move_to(p);
        path.line_to(cp1);
        var i;
        var N = commands.length;
        for (i = 0; i < N; i++) {
            // skip until cp1
            if (commands[i] == cp1.where) {
                break;
            }
        }
        i++;
        for (var j = 0; j < N; j++) {
            var cmd = commands[(i + j) % N];
            // skip until cp1
            if (typeof(cmd) == 'string') {
                if (cmd == cp2.where) break;
            }else {
                // cmd is function
                cmd();
            }
        }
        path.line_to(cp2);
        path.close();

    }else {
        path.move_to(points[3][1]);
        for (var i = 0; i < 4; i++) {
            path.circle_arc_to(RADIUS, points[i][0]);
            path.line_to(points[i][1]);
        }
        path.close();
    }

    return path;
};

