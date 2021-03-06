import { clientPoint } from 'd3-selection'

export default class Point {
  constructor(x, y) {
    this.x = x || 0
    this.y = y || 0
  }

  _within(min, max, minIncl, maxIncl, value) {
    return (minIncl ? value >= min : value > min)
      && (maxIncl ? value <= max : value < max)
  }

  withinX(min, max, minIncl, maxIncl) {
    return this._within(min, max, minIncl, maxIncl, this.x)
  }

  withinY(min, max, minIncl, maxIncl) {
    return this._within(min, max, minIncl, maxIncl, this.y)
  }

  diff(other) {
    return other ? new Point(this.x - other.x, this.y - other.y) : this
  }

  translate(diffX, diffY) {
    return new Point(this.x + (diffX || 0), this.y + (diffY || 0))
  }

  scale(scaleX, scaleY) {
    return new Point(
      this.x*(scaleX === undefined ? 1 : scaleX),
      this.y*(scaleY === undefined ? 1 : scaleY))
  }

  static fromEvent(container, event) {
    if (container && event) {
      const rawPoint = clientPoint(container, event.sourceEvent || event)
      return rawPoint ? new Point(rawPoint[0], rawPoint[1]) : undefined
    }
  }
}
