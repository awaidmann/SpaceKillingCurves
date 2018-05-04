export default class Geohash {
  constructor(minX, maxX, minY, maxY) {
    this.minXBoundary = minX || GeoHash.MIN_BOUNDARY
    this.maxXBoundary = maxX || GeoHash.MAX_BOUNDARY

    this.minYBoundary = minY || GeoHash.MIN_BOUNDARY
    this.maxYBoundary = maxY || GeoHash.MAX_BOUNDARY
  }

  static maxBoundary() {
    return Math.pow(2, 52)
  }

  static minBoundary() {
    return -1 * maxBoundary()
  }
}
