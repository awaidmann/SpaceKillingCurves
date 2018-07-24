import { List } from 'immutable'

export default class Path {
  constructor(points, transformFn) {
    this._points = List.isList(points) ? points : List(points || [])
    this._transformFn = transformFn || ((p) => p)
  }

  invert(transform) {
    return new Path(this._points, (p) => {
      return p && transform
        ? p.translate(-1*transform.x, -1*transform.y)
            .scale(1/transform.k, 1/transform.k)
        : p
    })
  }

  normalize(transform) {
    return new Path(this._points, (p) => {
      return p && transform
        ? p.scale(transform.k, transform.k)
            .translate(transform.x, transform.y)
        : p
    })
  }

  add(point) {
    return point
      ? new Path(this._points.push(point), this._transformFn)
      : this
  }

  head() {
    return this._transformFn(this._points.first())
  }

  tail() {
    return new Path(this._points.rest(), this._transformFn)
  }

  forEach(fn) {
    this._points.forEach(p => fn(this._transformFn(p)))
  }

  sample(n) {
    const max = this._points.size
    return new Path(
      this._points.filter((p, i) => (i%n === 0 || i === max)),
      this._transformFn)
  }

  toArray() {
    return this._points.map(this._transformFn).toArray()
  }
}
