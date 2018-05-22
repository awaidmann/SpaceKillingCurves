import Point from './Point'

export default class ViewRect {
  constructor(origin, extent) {
    this.origin = origin || new Point()
    this.extent = extent || new Point()
  }

  scale(scaleX, scaleY) {
    return new ViewRect(
      this.origin.scale(scaleX, scaleY),
      this.extent.scale(scaleX, scaleY)
    )
  }

  scalePositionPreserving(scaleX, scaleY) {
    return new ViewRect(
      this.origin,
      this.extent
        .scale(scaleX, scaleY)
        .translate(this.origin.x, this.origin.y)
    )
  }

  translate(diffX, diffY) {
    return new ViewRect(
      this.origin.translate(diffX, diffY),
      this.extent.translate(diffX, diffY)
    )
  }

  width() {
    return this.extent.diff(this.origin).x
  }

  height() {
    return this.extent.diff(this.origin).y
  }
}
