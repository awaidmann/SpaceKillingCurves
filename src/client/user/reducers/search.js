import { RESIZE, TRANSFORM } from '../../shared/actions'
import Geohash from '../../shared/geometry/Geohash'
import Point from '../../shared/geometry/Point'
import ViewRect from '../../shared/geometry/ViewRect'
import { Morton } from '../../shared/geometry/curve'


const INITIAL_STATE = {
  search: {
    viewPrefixes: []
  }
}

function curveForProjectState(project) {
  if (project) {
    const current = project.projects[project.current.id]
    if (current) {
      const bounds = current.details.geohash
      return new Morton(
        new Geohash(bounds.xMin, bounds.xMax, bounds.yMin, bounds.yMax),
        new Point(current.details.origin.x, current.details.origin.y)
      )
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

function search(state = INITIAL_STATE, action) {
  const curve = curveForProjectState(state.project)
  if (curve) {
    switch(action.type) {
      case RESIZE:
        return {
          viewPrefixes: curve.quadrantRangesForSearch(
            computeViewRect(state.transform, action.dimensions))
        }
      case TRANSFORM:
        return {
          viewPrefixes: curve.quadrantRangesForSearch(
              computeViewRect(action.transform, state.dimensions))
        }
    }
  }
  return state.search || INITIAL_STATE.search
}

export default search
