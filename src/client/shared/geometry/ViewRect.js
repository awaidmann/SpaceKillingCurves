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
      this.origin.translate(
        this.width() * (scaleX || 1),
        this.height() * (scaleY || 1)
      )
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

  toCanvasRect() {
    return {
      x: this.origin.x,
      y: this.origin.y,
      width: this.width(),
      height: this.height(),
    }
  }
}
