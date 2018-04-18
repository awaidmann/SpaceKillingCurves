'use strict'

var Bezier = function(startCoor, endCoor, controlPointA, controlPointB) {
  this.start = startCoor || {}
  this.end = endCoor || {}
  this.cpA = controlPointA || {}
  this.cpB = controlPointB || {}
}

Bezier.empty = function() { return new Bezier() }

Bezier.cubicBezierControlPointsFromDataPoints = function(dataPoints) {
  // http://www.math.ucla.edu/~baker/149.1.02w/handouts/dd_splines.pdf

  // efficient storage: for all members of the [M|C] augmented matrix, the
  // 1,4,1 offset is that row's index - 1, hence the 0th row is shifted
  // past the start, the 1st has no leading 0s, the 2nd has 1 leading 0, &c.
  // as long as were careful about how JS treats negative indices we can use
  // this to store what would be an n*(n+2) array as a n*(3+2) array instead.
  //
  // Because of the diagonal shape of the 1,4,1 matrix, the 2nd row-echelon
  // form condition (all leading values must be to the right of the row
  // above) pivoting whole rows is not necessary. Meaning, the order of rows
  // is static; only values change. Roughly speaking we could get Big-O on
  // the order of 5N ~= N.
  // Row Echelon pass (down): 1 mult, then 1 mult + 1 add
  // Reduced Row Echelon pass (up): 1 mult + 1 add

  if (dataPoints && dataPoints.length) {
    if (dataPoints.length == 1) {
      return [new Bezier(dataPoints[0], dataPoints[0], dataPoints[0], dataPoints[0])]
    }
    var controlPoints = []

    var prevREF = [0, 0, 0]
    var prevCoor = { x: 0, y: 0 }
    // convert to row-echelon form
    for (var i = 1; i < dataPoints.length - 1; i++) {
      var coor = dataPoints[i]

      var interpolant,
          tempPrevREF
      var tempCoor = { x: 6*coor.x, y: 6*coor.y }

      if (i == 1) {
        interpolant = [0, 4, 1]
        tempCoor = {
          x: tempCoor.x - dataPoints[0].x,
          y: tempCoor.y - dataPoints[0].y
        }
      } else if (i == dataPoints.length - 2) {
        interpolant = [1, 4, 0]
        tempCoor = {
          x: tempCoor.x - dataPoints[dataPoints.length - 1].x,
          y: tempCoor.y - dataPoints[dataPoints.length - 1].y
        }
      } else {
        interpolant = [1, 4, 1]
      }

      tempCoor = {
        x: tempCoor.x - prevCoor.x,
        y: tempCoor.y - prevCoor.y
      }

      tempPrevREF = [
        interpolant[0] - prevREF[1],
        interpolant[1] - prevREF[2],
        interpolant[2]
      ]
      var factor = tempPrevREF[1]
      // shortcut, we know tempPrevREF[0] should always be 0, if not I fucked up somewhere
      tempPrevREF = [0, 1, tempPrevREF[2] / factor]
      tempCoor = { x: tempCoor.x / factor, y: tempCoor.y / factor }

      controlPoints[i-1] = [tempPrevREF, tempCoor]

      prevREF = tempPrevREF
      prevCoor = tempCoor
    }

    // convert to reduce row-echelon form
    for(var i = controlPoints.length - 2; i > -1; i--) {
      var factor = controlPoints[i][0][2]

      controlPoints[i] = [
        [0, 1, 0],
        {
          x: controlPoints[i][1].x - factor*controlPoints[i+1][1].x,
          y: controlPoints[i][1].y - factor*controlPoints[i+1][1].y
        }
      ]
    }
    // console.log(controlPoints)
    // [[Si, Si+1, Bi, Bi+1], ...]
    var beziers = [[,dataPoints[0]]]
      .concat(controlPoints)
      .concat([[,dataPoints[dataPoints.length - 1]]])
      .map((cp, i, data) => {
        if (i < dataPoints.length - 1) {
          var b = cp[1]
          var bNext = data[i+1][1]
          var bX = b.x - bNext.x
          var bY = b.y - bNext.y

          return new Bezier(
            dataPoints[i],
            dataPoints[i+1],
            { x: b.x - bX/3, y: b.y - bY/3 },
            { x: bNext.x + bX/3, y: bNext.y + bY/3 }
          )
        } else {
          return Bezier.empty()
        }
      })
    beziers.pop()
    return beziers
  } else {
    return []
  }
}

Bezier.boundingBox = function(bezier) {
  function safeComp(vals, fn, def) {
    return fn.apply(null, vals.map(x => x || def))
  }

  var minX = safeComp([bezier.start.x, bezier.end.x, bezier.cpA.x, bezier.cpB.x], Math.min, Number.MAX_SAFE_INTEGER)
  var minY = safeComp([bezier.start.y, bezier.end.y, bezier.cpA.y, bezier.cpB.y], Math.min, Number.MAX_SAFE_INTEGER)
  var maxX = safeComp([bezier.start.x, bezier.end.x, bezier.cpA.x, bezier.cpB.x], Math.max, Number.MIN_SAFE_INTEGER)
  var maxY = safeComp([bezier.start.y, bezier.end.y, bezier.cpA.y, bezier.cpB.y], Math.max, Number.MIN_SAFE_INTEGER)

  return {
    left: minX,
    right: maxX,
    top: minY,
    bottom: maxY,
    center: { x: (minX + maxX) / 2, y: (minY + maxY) / 2 }
  }
}
