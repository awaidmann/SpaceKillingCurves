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

  translate(diffX, diffY) {
    return new ViewRect(
      this.origin.translate(diffX, diffY),
      this.extent.translate(diffX, diffY)
    )
  }
}
