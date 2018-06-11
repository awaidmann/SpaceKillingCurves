import Geohash from '../../shared/geometry/Geohash'
import Point from '../../shared/geometry/Point'
import ViewRect from '../../shared/geometry/ViewRect'
import { Morton } from '../../shared/geometry/curve'

function curveForProjectState(currentProject) {
  if (currentProject) {
    const bounds = currentProject.geohash
    return currentProject.curve === 'morton'
      ? new Morton(
          new Geohash(bounds.xMin, bounds.xMax, bounds.yMin, bounds.yMax),
          new Point(currentProject.origin.x, currentProject.origin.y)
        )
      : undefined
  }
}

function computeViewRect(transform, dimensions) {
  return (
    new ViewRect(
      new Point(0, 0),
      new Point(dimensions.width, dimensions.height)
    ))
    .translate(-1*transform.x, -1*transform.y)
    .scale(1/transform.k, 1/transform.k)
}

export function prefixes(transform, dimensions, currentProject) {
  const curve = curveForProjectState(currentProject)
  return curve
    ? curve.quadrantRangesForSearch(
        computeViewRect(transform, dimensions),
        currentProject.queryLimit)
    : []
}

export function rectsForQuadrantPrefixes(prefixes, currentProject) {
  const curve = curveForProjectState(currentProject)
  return (curve && prefixes)
    ? prefixes.map(prefix => curve.rectForQuadrant(prefix).toCanvasRect())
    : []
}
