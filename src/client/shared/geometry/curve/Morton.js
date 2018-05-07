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

        if (xSubQT.isSentinel() && ySubQT.left && ySubQT.left.isSentinel()) {
          subPaths = subPaths.concat(path.map(p => p + QTNode.leftPrefix()))
        } else {
          subPaths = subPaths.concat(
            ySubQTExp.left && xSubQTExp.left
              ? combineQuadTreesRec(xSubQTExp.left, ySubQTExp.left, path.map(p => p + QTNode.leftPrefix() + QTNode.leftPrefix()))
              : [],
            ySubQTExp.left && xSubQTExp.right
              ? combineQuadTreesRec(xSubQTExp.right, ySubQTExp.left, path.map(p => p + QTNode.leftPrefix() + QTNode.rightPrefix()))
              : []
          )
        }

        if (xSubQT.isSentinel() && ySubQT.right && ySubQT.right.isSentinel()) {
          subPaths = subPaths.concat(path.map(p => p + QTNode.rightPrefix()))
        } else {
          subPaths = subPaths.concat(
            ySubQTExp.right && xSubQTExp.left
              ? combineQuadTreesRec(xSubQTExp.left, ySubQTExp.right, path.map(p => p + QTNode.rightPrefix() + QTNode.leftPrefix()))
              : [],
            ySubQTExp.right && xSubQTExp.right
              ? combineQuadTreesRec(xSubQTExp.right, ySubQTExp.right, path.map(p => p + QTNode.rightPrefix() + QTNode.rightPrefix()))
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
      && adjPoint.withinX(this.geohash.minXBoundary, this.geohash.maxXBoundary, true, true)
      && adjPoint.withinY(this.geohash.minYBoundary, this.geohash.maxYBoundary, true, true)
    ) {
      return quadrantForPointRec(
        this.geohash.minXBoundary,
        this.geohash.maxXBoundary,
        this.geohash.minYBoundary,
        this.geohash.maxYBoundary
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
