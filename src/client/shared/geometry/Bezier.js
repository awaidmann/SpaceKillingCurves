import Point from './Point'

export default class Bezier {
  constructor(startCoor, endCoor, controlPointA, controlPointB) {
    this.start = startCoor
    this.end = endCoor
    this.cpA = controlPointA
    this.cpB = controlPointB
  }

  boundingBox() {
    function safeComp(vals, fn, def) {
      return fn.apply(null, vals.map(x => x || def))
    }

    const minX = safeComp([this.start.x, this.end.x, this.cpA.x, this.cpB.x], Math.min, Number.MAX_SAFE_INTEGER)
    const minY = safeComp([this.start.y, this.end.y, this.cpA.y, this.cpB.y], Math.min, Number.MAX_SAFE_INTEGER)
    const maxX = safeComp([this.start.x, this.end.x, this.cpA.x, this.cpB.x], Math.max, Number.MIN_SAFE_INTEGER)
    const maxY = safeComp([this.start.y, this.end.y, this.cpA.y, this.cpB.y], Math.max, Number.MIN_SAFE_INTEGER)

    return {
      left: minX,
      right: maxX,
      top: minY,
      bottom: maxY,
      center: new Point((minX + maxX) / 2, (minY + maxY) / 2)
    }
  }

  static empty() {
    return new Bezier()
  }

  static cubicBezierControlPointsFromDataPoints(dataPoints) {
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
      let controlPoints = []

      let prevREF = [0, 0, 0]
      let prevCoor = new Point()
      // convert to row-echelon form
      for (let i = 1; i < dataPoints.length - 1; i++) {
        let coor = dataPoints[i]

        let interpolant,
            tempPrevREF
        let tempCoor = coor.scale(6, 6)

        if (i == 1) {
          interpolant = [0, 4, 1]
          tempCoor = tempCoor.diff(dataPoints[0])
        } else if (i == dataPoints.length - 2) {
          interpolant = [1, 4, 0]
          tempCoor = tempCoor.diff(dataPoints[dataPoints.length - 1])
        } else {
          interpolant = [1, 4, 1]
        }

        tempCoor = tempCoor.diff(prevCoor)
        tempPrevREF = [
          interpolant[0] - prevREF[1],
          interpolant[1] - prevREF[2],
          interpolant[2]
        ]
        const factor = tempPrevREF[1]
        // shortcut, we know tempPrevREF[0] should always be 0, if not I fucked up somewhere
        tempPrevREF = [0, 1, tempPrevREF[2] / factor]
        tempCoor = tempCoor.scale(1/factor, 1/factor)

        controlPoints[i-1] = [tempPrevREF, tempCoor]

        prevREF = tempPrevREF
        prevCoor = tempCoor
      }

      // convert to reduce row-echelon form
      for(let i = controlPoints.length - 2; i > -1; i--) {
        const factor = controlPoints[i][0][2]

        controlPoints[i] = [
          [0, 1, 0],
          controlPoints[i][1].diff(
            controlPoints[i+1][1].scale(factor, factor)
          )
        ]
      }
      // console.log(controlPoints)
      // [[Si, Si+1, Bi, Bi+1], ...]
      let beziers = [[,dataPoints[0]]]
        .concat(controlPoints)
        .concat([[,dataPoints[dataPoints.length - 1]]])
        .map((cp, i, data) => {
          if (i < dataPoints.length - 1) {
            const b = cp[1]
            const bNext = data[i+1][1]
            const bounds = b.diff(bNext).scale(1/3, 1/3)

            return new Bezier(
              dataPoints[i],
              dataPoints[i+1],
              b.diff(bounds),
              bNext.translate(bounds.x, bounds.y)
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
}
