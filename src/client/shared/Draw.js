export const DEFAULT_STYLE = {
  lineWidth: 1,
  strokeStyle: "red",
  fillStyle: "red",
  cpRadius: 2,
  originRadius: 4
}

export class Draw {
  constructor(ctx, style) {
    this.ctx = ctx
    this.style = Object.assign({}, DEFAULT_STYLE, style)
  }

  cubicBeziers(beziers) {
    return (windowRect) => {
      return (transform) => {
        this.ctx.save()

        this.ctx.clearRect(windowRect.x, windowRect.y, windowRect.width, windowRect.height)
        if (transform) {
          this.ctx.translate(transform.x, transform.y)
          this.ctx.scale(transform.k, transform.k)
        }

        if (beziers && beziers.length) {
          this.ctx.lineWidth = this.style.lineWidth
          this.ctx.strokeStyle = this.style.strokeStyle
          this.ctx.fillStyle = this.style.fillStyle

          beziers.reduce(
            (draw, bezier) => draw._cubicBezier(bezier),
            this._controlPoint(beziers[0].start, this.style.originRadius)
          )
        }

        this.ctx.restore()
        return this
      }
    }
  }

  _cubicBezier(bezier) {
    if (bezier) {
      this.ctx.beginPath()
      this.ctx.moveTo(bezier.start.x, bezier.start.y)
      this.ctx.bezierCurveTo(
        bezier.cpA.x, bezier.cpA.y,
        bezier.cpB.x, bezier.cpB.y,
        bezier.end.x, bezier.end.y
      )
      this.ctx.stroke()
    }
    return this
  }

  _controlPoint(cp, radius) {
    if (cp) {
      this.ctx.beginPath()
      this.ctx.arc(cp.x, cp.y, radius, 0, 2*Math.PI)
      this.ctx.fill()
    }
    return this
  }
}
