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

const TILE_TYPE = {
  BEZIER: "bezier"
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

          partialDrawFns.forEach(fn => fn && fn(this.ctx, this.style))

          this.ctx.restore()
        }
        return this
      }
    }
  }

  static _collection(ctx, style, coll, collApply) {
    if (ctx && coll && coll.length) {
      ctx.lineWidth = style.lineWidth
      ctx.strokeStyle = style.strokeStyle
      ctx.fillStyle = style.fillStyle

      coll.forEach(x => collApply(ctx, x))
    }
  }

  static _applyForType(type) {
    switch(type) {
      case TILE_TYPE.BEZIER:
        return Draw._cubicBezier
      default:
        return () => { console.log('unkonwn tile type: ' + type) }
    }
  }

  static tiles(tiles) {
    return (ctx, style) => {
      if (ctx && style && tiles) {
        tiles.forEach(
          tile => {
            if (!tile || !tile.data) return
            const type = tile.data.type
            const tileStyle = Object.assign({}, style.default, style[type])

            ctx.lineWidth = tileStyle.lineWidth
            ctx.strokeStyle = tileStyle.strokeStyle
            ctx.fillStyle = tileStyle.fillStyle
            Draw._applyForType(type)(ctx, tile.data)
          })
      }}
  }

  static cubicBeziers(beziers) {
    return (ctx, style) => {
      Draw._collection(
        ctx,
        Object.assign({}, style.default, style.bezier),
        beziers,
        Draw._cubicBezier
      )
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

  static boundingRects(rects) {
    return (ctx, style) => {
      Draw._collection(
        ctx,
        Object.assign({}, style.default, style.rect),
        rects,
        Draw._rect
      )
    }
  }

  static _rect(ctx, rect) {
    if (ctx && rect) {
      ctx.beginPath()
      ctx.rect(rect.x, rect.y, rect.width, rect.height)
      ctx.stroke()
    }
  }
}

export default Draw
