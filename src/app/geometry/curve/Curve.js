import Point from '../Point'

export default class Curve {
  constructor(geohash, origin) {
    this.origin = origin || new Point()
    this.geohash = geohash
  }

  quadrantForPoint(point, threshold) {}

  quadrantForPointAsString(point, threshold) {
    var quad = this.quadrantForPoint(point, threshold)
    return quad ? quad.reduce((s, q) => s+q, "") : ""
  }

  quadrantRangesForSearch(viewRect, maxRanges) {}

  rectForQuadrant(quadrant) {}
}
