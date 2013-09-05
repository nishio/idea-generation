/**
 * (c) 2013, Cybozu.
 */
goog.require('nhiro.V2');
goog.provide('nhiro.convex_hull');

/**
 * @param {Array.<nhiro.V2>} points .
 * @return {Array.<nhiro.V2>} .
 */
nhiro.convex_hull = function(points) {
    /**
     * @param {Array.<nhiro.V2>} baseLine .
     * @param {Array.<nhiro.V2>} points .
     * @return {{maxPoint: (undefined|nhiro.V2), newPoints: Array.<nhiro.V2>}}
     */
    function findMostDistantPointFromBaseLine(baseLine, points) {
        var line_nvec = baseLine[0].sub(baseLine[1]).rot90();
        var maxD = 0;
        var maxPt;
        var newPoints = [];
        for (var i in points) {
            var p = points[i];
            var d = line_nvec.dot(p.sub(baseLine[0]));
            if (d > maxD) {
                maxD = d;
                maxPt = p;
            }
            if (d > 0) {
                newPoints.push(p);
            }
        }
        return {'maxPoint': maxPt, 'newPoints': newPoints};
    }

    /**
     * @param {Array.<nhiro.V2>} baseLine length==2.
     * @param {Array.<nhiro.V2>} points .
     * @return {Array.<Array.<nhiro.V2>>} .
     */
    function buildConvexHull(baseLine, points) {
        var convexHullBaseLines = [];
        var t = findMostDistantPointFromBaseLine(baseLine, points);
        if (t.maxPoint !== undefined) {
            // if there is still a point "outside" the base line
            convexHullBaseLines =
                convexHullBaseLines.concat(
                    buildConvexHull([baseLine[0], t.maxPoint], t.newPoints)
                );
            convexHullBaseLines =
                convexHullBaseLines.concat(
                    buildConvexHull([t.maxPoint, baseLine[1]], t.newPoints)
                );
            return convexHullBaseLines;
        } else {
            // if there is no more point "outside" the base line,
            // the current base line is part of the convex hull
            return [baseLine];
        }
    }

    /**
     * @param {Array.<nhiro.V2>} points .
     * @return {Array.<Array.<nhiro.V2>>} .
     */
    function getConvexHull(points) {
        //find first baseline
        var maxX, minX;
        var maxPt, minPt;
        for (var idx in points) {
            var pt = points[idx];
            if (pt.x > maxX || !maxX) {
                maxPt = pt;
                maxX = pt.x;
            }
            if (pt.x < minX || !minX) {
                minPt = pt;
                minX = pt.x;
            }
        }
        var ch = [].concat(buildConvexHull([minPt, maxPt], points),
            buildConvexHull([maxPt, minPt], points));
        return ch;
    }


    var baselines = getConvexHull(points);
    var result = [];
    for (var i in baselines) {
        result.push(new nhiro.V2(baselines[i][0]));
    }
    return result;
};

goog.exportSymbol('nhiro.convex_hull', nhiro.convex_hull);
