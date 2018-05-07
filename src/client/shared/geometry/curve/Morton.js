import Point from '../Point'
import Curve from './Curve'

class QTNode {
  constructor(left, right) {
    this.left = left
    this.right = right
  }

  static leftPrefix() { return "0" }

  static rightPrefix() { return "1" }

  reduceIfSentinelNodes() {
    return (this.left && this.left.isSentinel() && this.right && this.right.isSentinel())
      ? new QTSentinel()
      : this
  }

  isSentinel() { return false }
}

class QTSentinel extends QTNode {
  constructor() {
    super()
  }

  isSentinel() { return true }
}


export default class Morton extends Curve {
  _quadTreeForRanges(lower, upper) {
    let t = new QTNode()

    const lHead = lower[0]
    const uHead = upper[0]

    if (lHead != undefined && uHead != undefined && lHead == uHead) {
      const range = this._quadTreeForRanges(lower.slice(1), upper.slice(1))
      t = lHead
        ? new QTNode(undefined, range)
        : new QTNode(range, undefined)
    } else if (lHead == 1) {
      t = new QTNode(undefined, this._quadTreeForRanges(lower.slice(1), []))
    } else if (uHead == 0) {
      t = new QTNode(this._quadTreeForRanges([], upper.slice(1)), undefined)
    } else {
      t = new QTNode(
        lHead == 0 ? this._quadTreeForRanges(lower.slice(1), []) : new QTSentinel(),
        uHead == 1 ? this._quadTreeForRanges([], upper.slice(1)) : new QTSentinel()
      )
    }
    return t.reduceIfSentinelNodes()
  }

  _combineQuadTrees(xQT, yQT) {
    function combineQuadTreesRec(xSubQT, ySubQT, path) {
      if (!ySubQT || !xSubQT || (ySubQT.isSentinel() && xSubQT.isSentinel())) {
        return path
      } else {
        let subPaths = []
        const xSubQTExp = xSubQT.isSentinel()
          ? new QTNode(new QTSentinel(), new QTSentinel())
          : xSubQT
        const ySubQTExp = ySubQT.isSentinel()
          ? new QTNode(new QTSentinel(), new QTSentinel())
          : ySubQT

        if (xSubQT.isSentinel() && ySubQT.l.isSentinel()) {
          subPaths = subPaths.concat(path.map(p => p + QTNode.leftPrefix()))
        } else {
          subPaths = subPaths.concat(
            ySubQTExp.l && xSubQTExp.l
              ? combineQuadTreesRec(xSubQTExp.l, ySubQTExp.l, path.map(p => p + QTNode.leftPrefix() + QTNode.leftPrefix()))
              : [],
            ySubQTExp.l && xSubQTExp.r
              ? combineQuadTreesRec(xSubQTExp.r, ySubQTExp.l, path.map(p => p + QTNode.leftPrefix() + QTNode.rightPrefix()))
              : []
          )
        }

        if (xSubQT.isSentinel() && ySubQT.r.isSentinel()) {
          subPaths = subPaths.concat(path.map(p => p + QTNode.rightPrefix()))
        } else {
          subPaths = subPaths.concat(
            ySubQTExp.r && xSubQTExp.l
              ? combineQuadTreesRec(xSubQTExp.l, ySubQTExp.r, path.map(p => p + QTNode.rightPrefix() + QTNode.leftPrefix()))
              : [],
            ySubQTExp.r && xSubQTExp.r
              ? combineQuadTreesRec(xSubQTExp.r, ySubQTExp.r, path.map(p => p + QTNode.rightPrefix() + QTNode.rightPrefix()))
              : []
          )
        }
        return subPaths
      }
    }
    return combineQuadTreesRec(xQT, yQT, [""])
  }

  quadrantForPoint(point, threshold) {
    const th = threshold !== undefined ? threshold : 1
    const adjPoint = point ? point.diff(this.origin) : undefined

    function quadrantForPointRec(minX, maxX, minY, maxY, quadKey) {
      const midX = (minX + maxX) / 2
      const midY = (minY + maxY) / 2

      if ((midX - minX) >= th && (midY - minY) >= th) {
        const xArgs = adjPoint.withinX(minX, midX, true) ? [minX, midX, 0] : [midX, maxX, 1]
        const yArgs = adjPoint.withinY(minY, midY, true) ? [minY, midY, 0] : [midY, maxY, 1]

        return quadrantForPointRec(
          xArgs[0], xArgs[1], yArgs[0], yArgs[1],
          (quadKey || []).concat([yArgs[2], xArgs[2]])
        )
      }
      return quadKey || []
    }

    if (adjPoint
      && adjPoint.withinX(this.geoHash.minXBoundary, this.geoHash.maxXBoundary, true, true)
      && adjPoint.withinY(this.geoHash.minYBoundary, this.geoHash.maxYBoundary, true, true)
    ) {
      return quadrantForPointRec(
        this.geoHash.minXBoundary,
        this.geoHash.maxXBoundary,
        this.geoHash.minYBoundary,
        this.geoHash.maxYBoundary
      )
    } else {
      return
    }
  }

  quadrantRangesForSearch(viewRect, maxRanges) {
    const topLeft = this.quadrantForPoint(viewRect.origin)
    const bottomRight = this.quadrantForPoint(viewRect.extent)

    const ySearchTree = this._quadTreeForRanges(
      topLeft.filter((x, i) => i%2==0),
      bottomRight.filter((x, i) => i%2==0),
      []
    )
    const xSearchTree = this._quadTreeForRanges(
      topLeft.filter((x, i) => i%2==1),
      bottomRight.filter((x, i) => i%2==1),
      []
    )

    return this._combineQuadTrees(xSearchTree, ySearchTree)
  }
}
