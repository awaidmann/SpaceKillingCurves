export const DEFAULT_STYLE = {
  default: {
    lineWidth: 1,
    strokeStyle: "red",
    fillStyle: "red",
  },
  bezier: {},
  controlPoint: {
    cpRadius: 2,
    originRadius: 4,
  },
  rect: {
    strokeStyle: "blue",
    fillStyle: "clear",
  }
}

class Draw {
  constructor(ctx, style) {
    this.ctx = ctx
    this.style = Object.assign({}, DEFAULT_STYLE, style)
  }

  pipeline() {
    const partialDrawFns = Array.from(arguments)
    return (windowRect) => {
      return (transform) => {
        if (partialDrawFns && partialDrawFns.length) {
          this.ctx.save()

          this.ctx.clearRect(windowRect.x, windowRect.y, windowRect.width, windowRect.height)
          if (transform) {
            this.ctx.translate(transform.x, transform.y)
            this.ctx.scale(transform.k, transform.k)
          }

          partialDrawFns.forEach(fn => fn(this.ctx, this.style))

          this.ctx.restore()
        }
        return this
      }
    }
  }

  static cubicBeziers(beziers) {
    return (ctx, style) => {
      if (ctx && beziers && beziers.length) {
        const bezierStyle = Object.assign({}, style.default, style.bezier)

        ctx.lineWidth = bezierStyle.lineWidth
        ctx.strokeStyle = bezierStyle.strokeStyle
        ctx.fillStyle = bezierStyle.fillStyle

        beziers.forEach(bezier => Draw._cubicBezier(ctx, bezier))
      }
    }
  }

  static _cubicBezier(ctx, bezier) {
    if (bezier) {
      ctx.beginPath()
      ctx.moveTo(bezier.start.x, bezier.start.y)
      ctx.bezierCurveTo(
        bezier.cpA.x, bezier.cpA.y,
        bezier.cpB.x, bezier.cpB.y,
        bezier.end.x, bezier.end.y
      )
      ctx.stroke()
    }
  }

  static origin(origin) {
    return (ctx, style) => {
      if (ctx && origin) {
        const cpStyle = Object.assign({}, style.default, style.controlPoint)
        ctx.strokeStyle = cpStyle.strokeStyle
        ctx.fillStyle = cpStyle.fillStyle

        Draw._controlPoint(ctx, origin, cpStyle.originRadius)
      }
    }
  }

  static _controlPoint(ctx, cp, radius) {
    if (ctx && cp) {
      ctx.beginPath()
      ctx.arc(cp.x, cp.y, radius, 0, 2*Math.PI)
      ctx.fill()
    }
  }
}

export default Draw
