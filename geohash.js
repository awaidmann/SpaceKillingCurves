'use strict'

var GeoHash = function(minX, maxX, minY, maxY) {
  this.minXBoundary = minX || GeoHash.MIN_BOUNDARY
  this.maxXBoundary = maxX || GeoHash.MAX_BOUNDARY

  this.minYBoundary = minY || GeoHash.MIN_BOUNDARY
  this.maxYBoundary = maxY || GeoHash.MAX_BOUNDARY
}

GeoHash.MAX_BOUNDARY = Math.pow(2, 52) // Number.MAX_SAFE_INTEGER = 2^53 - 1
GeoHash.MIN_BOUNDARY = -1 * GeoHash.MAX_BOUNDARY

GeoHash.default = function() { return new GeoHash() }

var Curve = function(geoHash, origin) {
  this.origin = origin || { x: 0, y: 0 }
  this.geoHash = geoHash
}
Curve.prototype.quadrantForPoint = function(point) {}
Curve.prototype.quadrantForBezier = function(bezier, threshold) {
  return this.quadrantForPointAsString(Bezier.boundingBox(bezier).center, threshold)
}
Curve.prototype.quadrantForPointAsString = function(point, threshold) {
  var quad = this.quadrantForPoint(point, threshold)
  return quad ? quad.reduce((s, q) => s+q, "") : ""
}

Curve.prototype.quadrantRangesForSearch = function(viewRect, maxRanges) {}


var Morton = function(geoHash, origin) {
  Curve.call(this, geoHash, origin)
}

Morton.prototype = Object.create(Curve.prototype)
Morton.prototype.constructor = Morton

Morton._QUAD_SENTINEL = {}

Morton._quadTreeForRanges = function(lower, upper) {
  var t = {}

  var lHead = lower[0]
  var uHead = upper[0]

  if (lHead != undefined && uHead != undefined && lHead == uHead) {
    t[lHead ? "r" : "l"] = Morton._quadTreeForRanges(lower.slice(1), upper.slice(1))
  } else if (lHead == 1) {
    t = { r: Morton._quadTreeForRanges(lower.slice(1), []) }
  } else if (uHead == 0) {
    t = { l: Morton._quadTreeForRanges([], upper.slice(1)) }
  } else {
    t = {
      l: lHead == 0 ? Morton._quadTreeForRanges(lower.slice(1), []) : Morton._QUAD_SENTINEL,
      r: uHead == 1 ? Morton._quadTreeForRanges([], upper.slice(1)) : Morton._QUAD_SENTINEL
    }
  }
  return (t.l === Morton._QUAD_SENTINEL && t.r === Morton._QUAD_SENTINEL)
    ? Morton._QUAD_SENTINEL
    : t
}

Morton._combineQuadTrees = function(xQT, yQT) {
  function combineQuadTreesRec(xSubQT, ySubQT, path) {
    if (!ySubQT || !xSubQT || (ySubQT === Morton._QUAD_SENTINEL && xSubQT === Morton._QUAD_SENTINEL)) {
        return path
    } else {
      var subPaths = []
      var xSubQTExp = xSubQT === Morton._QUAD_SENTINEL
        ? { l: Morton._QUAD_SENTINEL, r: Morton._QUAD_SENTINEL }
        : xSubQT
      var ySubQTExp = ySubQT === Morton._QUAD_SENTINEL
        ? { l: Morton._QUAD_SENTINEL, r: Morton._QUAD_SENTINEL }
        : ySubQT

      if (xSubQT === Morton._QUAD_SENTINEL && ySubQT.l === Morton._QUAD_SENTINEL) {
        subPaths = subPaths.concat(path.map(p => p + "0"))
      } else {
        subPaths = subPaths.concat(
          ySubQTExp.l && xSubQTExp.l ? combineQuadTreesRec(xSubQTExp.l, ySubQTExp.l, path.map(p => p + "00")) : [],
          ySubQTExp.l && xSubQTExp.r ? combineQuadTreesRec(xSubQTExp.r, ySubQTExp.l, path.map(p => p + "01")) : []
        )
      }

      if (xSubQT === Morton._QUAD_SENTINEL && ySubQT.r === Morton._QUAD_SENTINEL) {
        subPaths = subPaths.concat(path.map(p => p + "1"))
      } else {
        subPaths = subPaths.concat(
          ySubQTExp.r && xSubQTExp.l ? combineQuadTreesRec(xSubQTExp.l, ySubQTExp.r, path.map(p => p + "10")) : [],
          ySubQTExp.r && xSubQTExp.r ? combineQuadTreesRec(xSubQTExp.r, ySubQTExp.r, path.map(p => p + "11")) : []
        )
      }
      return subPaths
    }
  }
  return combineQuadTreesRec(xQT, yQT, [""])
}

Morton.prototype.quadrantForPoint = function (point, threshold) {
  var th = threshold !== undefined ? threshold : 1
  var adjPoint = point
    ? { x: point.x - (this.origin.x || 0), y: point.y - (this.origin.y || 0) }
    : undefined

  function quadrantForPointRec(minX, maxX, minY, maxY, quadKey) {
    var midX = (minX + maxX) / 2
    var midY = (minY + maxY) / 2

    if ((midX - minX) >= th && (midY - minY) >= th) {
      var xArgs = adjPoint.x >= minX && adjPoint.x < midX ? [minX, midX, 0] : [midX, maxX, 1]
      var yArgs = adjPoint.y >= minY && adjPoint.y < midY ? [minY, midY, 0] : [midY, maxY, 1]

      return quadrantForPointRec(
        xArgs[0], xArgs[1], yArgs[0], yArgs[1],
        (quadKey || []).concat([yArgs[2], xArgs[2]])
      )
    }
    return quadKey || []
  }

  if (adjPoint
    && adjPoint.x >= this.geoHash.minXBoundary
    && adjPoint.x <= this.geoHash.maxXBoundary
    && adjPoint.y >= this.geoHash.minYBoundary
    && adjPoint.y <= this.geoHash.maxYBoundary
  ) {
    return quadrantForPointRec(
      this.geoHash.minXBoundary,
      this.geoHash.maxXBoundary,
      this.geoHash.minYBoundary,
      this.geoHash.maxYBoundary
    )
  } else {
    return
  }
}

Morton.prototype.quadrantRangesForSearch = function (viewRect, maxRanges) {
  var topLeft = this.quadrantForPoint({ x: viewRect.x, y: viewRect.y })
  var bottomRight = this.quadrantForPoint({ x: viewRect.x + viewRect.width, y: viewRect.y + viewRect.height })

  var ySearchTree = Morton._quadTreeForRanges(
    topLeft.filter((x, i) => i%2==0),
    bottomRight.filter((x, i) => i%2==0),
    []
  )
  var xSearchTree = Morton._quadTreeForRanges(
    topLeft.filter((x, i) => i%2==1),
    bottomRight.filter((x, i) => i%2==1),
    []
  )

  return Morton._combineQuadTrees(xSearchTree, ySearchTree)
}

var Hilbert = function(geoHash, origin) {
  Morton.call(this, geoHash, origin)
}

// adapted from: http://blog.notdot.net/2009/11/Damn-Cool-Algorithms-Spatial-indexing-with-Quadtrees-and-Hilbert-Curves
// [<Configuation index> [<Z-order quad>  [<Hilbert value>, <Next Configuation index>]]]
Hilbert._ROTATION_MAP = {
  "a": [[[0, 0], "b"], [[0, 1], "a"], [[1, 1], "c"], [[1, 0], "a"]],
  "b": [[[0, 0], "a"], [[1, 1], "d"], [[0, 1], "b"], [[1, 0], "b"]],
  "c": [[[1, 0], "c"], [[0, 1], "c"], [[1, 1], "a"], [[0, 0], "d"]],
  "d": [[[1, 0], "d"], [[1, 1], "b"], [[0, 1], "d"], [[0, 0], "c"]],
}

Hilbert.prototype = Object.create(Morton.prototype)
Hilbert.prototype.constructor = Hilbert

Hilbert.prototype.quadrantForPoint = function (point, threshold) {
  function hilbertFromMortonQuad(zOrder, parentQuad) {
    if (zOrder.length >= 2) {
      var quadSlice = zOrder.slice(0, 2)
      var quadNumeral = (quadSlice[0] << 1) | quadSlice[1]

      var nextQuadMap = Hilbert._ROTATION_MAP[parentQuad][quadNumeral]
      return nextQuadMap[0].concat(hilbertFromMortonQuad(zOrder.slice(2), nextQuadMap[1]))
    }

    return []
  }

  // call super type (Morton) method and then transform Morton encoding to Hilbert encoding
  var zOrderQuad = Morton.prototype.quadrantForPoint.call(this, point, threshold)
  return zOrderQuad ? hilbertFromMortonQuad(zOrderQuad, "b") : undefined
}
Hilbert.prototype.quadrantRangesForSearch = function (viewRect, maxRanges) {}
