import Point from '../Point'
import ViewRect from '../ViewRect'
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

function quadTreeForRanges(lower, upper) {
  let t = new QTNode()

  const lHead = lower[0]
  const uHead = upper[0]

  if (lHead != undefined && uHead != undefined && lHead == uHead) {
    const range = quadTreeForRanges(lower.slice(1), upper.slice(1))
    t = lHead
      ? new QTNode(undefined, range)
      : new QTNode(range, undefined)
  } else if (lHead == 1) {
    t = new QTNode(undefined, quadTreeForRanges(lower.slice(1), []))
  } else if (uHead == 0) {
    t = new QTNode(quadTreeForRanges([], upper.slice(1)), undefined)
  } else {
    t = new QTNode(
      lHead == 0 ? quadTreeForRanges(lower.slice(1), []) : new QTSentinel(),
      uHead == 1 ? quadTreeForRanges([], upper.slice(1)) : new QTSentinel()
    )
  }
  return t.reduceIfSentinelNodes()
}

function reduceQuadTreeRanges(qtRanges, maxRanges) {
  function reduceDepthSets(depthSets) {
    const totalRanges = depthSets.reduce((cnt, set) => cnt + set.size, 0)
    if (totalRanges > maxRanges) {
      const diff = totalRanges - maxRanges
      const parent = new Set(depthSets[depthSets.length - 2])
      const deepest = new Set(depthSets[depthSets.length - 1])
      const originalSize = deepest.size
      const deepestIter = deepest.values()

      const truncDepth = (depthSets.length - 1) * 2
      while(originalSize > diff
        ? deepest.size > diff
        : deepest.size
      ) {
        const range = deepestIter.next().value
        deepest.delete(range)
        parent.add(range.slice(0, truncDepth))
      }

      return reduceDepthSets(depthSets
        .slice(0, depthSets.length - 2)
        .concat(deepest.size ? [parent, deepest] : [parent]))
    } else {
      return depthSets
    }
  }

  const depthSets = qtRanges.reduce((qtSets, range) => {
    const i = Math.ceil(range.length / 2)
    qtSets[i] = (qtSets[i] || new Set()).add(range)
    return qtSets
  }, [])

  return reduceDepthSets(depthSets)
    .reduce((acc, set) => acc.concat(Array.from(set)), [])
}

function combineQuadTrees(xQT, yQT, maxRanges) {
  function combineQuadTreesRec(xSubQT, ySubQT, path) {
    if (!ySubQT || !xSubQT || (ySubQT.isSentinel() && xSubQT.isSentinel())) {
      return [path]
    } else {
      let subPaths = []
      const xSubQTExp = xSubQT.isSentinel()
        ? new QTNode(new QTSentinel(), new QTSentinel())
        : xSubQT
      const ySubQTExp = ySubQT.isSentinel()
        ? new QTNode(new QTSentinel(), new QTSentinel())
        : ySubQT

      if (xSubQT.isSentinel() && ySubQT.left && ySubQT.left.isSentinel()) {
        subPaths = subPaths.concat(path + QTNode.leftPrefix())
      } else {
        subPaths = subPaths.concat(
          ySubQTExp.left && xSubQTExp.left
            ? combineQuadTreesRec(xSubQTExp.left, ySubQTExp.left, path + QTNode.leftPrefix() + QTNode.leftPrefix())
            : [],
          ySubQTExp.left && xSubQTExp.right
            ? combineQuadTreesRec(xSubQTExp.right, ySubQTExp.left, path + QTNode.leftPrefix() + QTNode.rightPrefix())
            : []
        )
      }

      if (xSubQT.isSentinel() && ySubQT.right && ySubQT.right.isSentinel()) {
        subPaths = subPaths.concat(path + QTNode.rightPrefix())
      } else {
        subPaths = subPaths.concat(
          ySubQTExp.right && xSubQTExp.left
            ? combineQuadTreesRec(xSubQTExp.left, ySubQTExp.right, path + QTNode.rightPrefix() + QTNode.leftPrefix())
            : [],
          ySubQTExp.right && xSubQTExp.right
            ? combineQuadTreesRec(xSubQTExp.right, ySubQTExp.right, path + QTNode.rightPrefix() + QTNode.rightPrefix())
            : []
        )
      }
      return subPaths
    }
  }

  return reduceQuadTreeRanges(
    combineQuadTreesRec(xQT, yQT, ""),
    maxRanges
  )
}


export default class Morton extends Curve {
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

    const ySearchTree = quadTreeForRanges(
      topLeft.filter((x, i) => i%2==0),
      bottomRight.filter((x, i) => i%2==0),
      []
    )
    const xSearchTree = quadTreeForRanges(
      topLeft.filter((x, i) => i%2==1),
      bottomRight.filter((x, i) => i%2==1),
      []
    )

    return combineQuadTrees(xSearchTree, ySearchTree, maxRanges)
  }

  rectForQuadrant(quadrant) {
    function rectForQuadrantRec(quad, boundary) {
      if (quad && quad.length) {
        const current = quad.slice(0, 2)
        const scaled = boundary.scalePositionPreserving(1/current.length, 0.5)
        return rectForQuadrantRec(
          quad.slice(2),
          scaled.translate(
            current[1] == QTNode.rightPrefix() ? scaled.width() : 0,
            current[0] == QTNode.rightPrefix() ? scaled.height() : 0
          )
        )
      } else {
        return boundary
      }
    }

    return rectForQuadrantRec(
      quadrant,
      new ViewRect(
        new Point(this.geohash.minXBoundary, this.geohash.minYBoundary),
        new Point(this.geohash.maxXBoundary, this.geohash.maxYBoundary)
      )).translate(this.origin.x, this.origin.y)
  }
}
