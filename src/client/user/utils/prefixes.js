import Geohash from '../../shared/geometry/Geohash'
import Point from '../../shared/geometry/Point'
import ViewRect from '../../shared/geometry/ViewRect'
import { Morton } from '../../shared/geometry/curve'

function curveForProjectState(project) {
  if (project) {
    const current = project.projects[project.current.id]
    if (current) {
      const bounds = current.details.geohash
      return current.details.curve === 'morton'
        ? new Morton(
            new Geohash(bounds.xMin, bounds.xMax, bounds.yMin, bounds.yMax),
            new Point(current.details.origin.x, current.details.origin.y)
          )
        : undefined
    }
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

export function prefixes(transform, dimensions, project) {
  const curve = curveForProjectState(project)
  return curve
    ? curve.quadrantRangesForSearch(computeViewRect(transform, dimensions))
    : []
}
