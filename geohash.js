'use strict'

var GeoHash = function(minX, maxX, minY, maxY) {
  this.minXBoundary = minX || GeoHash.MIN_BOUNDARY
  this.maxXBoundary = maxX || GeoHash.MAX_BOUNDARY

  this.minYBoundary = minY || GeoHash.MIN_BOUNDARY
  this.maxYBoundary = maxY || GeoHash.MAX_BOUNDARY
}

GeoHash.MAX_BOUNDARY = Math.pow(2, 52) // Number.MAX_SAFE_INTEGER = 2^53 - 1
GeoHash.MIN_BOUNDARY = -1 * GeoHash.MAX_BOUNDARY

GeoHash.boundingBox = function (bezier) {
  function safeComp(vals, fn, def) {
    return fn.apply(null, vals.map(x => x || def))
  }

  if (bezier) {
    var minX = safeComp([bezier.s0.x, bezier.s1.x, bezier.b0.x, bezier.b1.x], Math.min, Number.MAX_SAFE_INTEGER)
    var minY = safeComp([bezier.s0.y, bezier.s1.y, bezier.b0.y, bezier.b1.y], Math.min, Number.MAX_SAFE_INTEGER)
    var maxX = safeComp([bezier.s0.x, bezier.s1.x, bezier.b0.x, bezier.b1.x], Math.max, Number.MIN_SAFE_INTEGER)
    var maxY = safeComp([bezier.s0.y, bezier.s1.y, bezier.b0.y, bezier.b1.y], Math.max, Number.MIN_SAFE_INTEGER)

    return {
      left: minX,
      right: maxX,
      top: minY,
      bottom: maxY,
      center: { x: (minX + maxX) / 2, y: (minY + maxY) / 2 }
    }
  }
  return
}


var Curve = function(geoHash, origin) {
  this.origin = origin || { x: 0, y: 0 }
  this.geoHash = geoHash
}
Curve.prototype.quadrantForPoint = function(point) {}
Curve.prototype.quadrantForBezier = function(bezier) {
  return this.quadrantForPoint((GeoHash.boundingBox(bezier) || {}).center)
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
