export default class Geohash {
  constructor(minX, maxX, minY, maxY) {
    this.minXBoundary = minX || GeoHash.minBoundary()
    this.maxXBoundary = maxX || GeoHash.maxBoundary()

    this.minYBoundary = minY || GeoHash.minBoundary()
    this.maxYBoundary = maxY || GeoHash.maxBoundary()
  }

  static maxBoundary() {
    return Math.pow(2, 52)
  }

  static minBoundary() {
    return -1 * maxBoundary()
  }
}
