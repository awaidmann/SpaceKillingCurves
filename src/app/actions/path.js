import { Bezier } from '../geometry'
import { PATH_FILTER } from '../defaults/editor'

export const PATH_APPEND = 'PATH_APPEND'
export const PATH_END = 'PATH_END'

export const BUFFERED_PATHS_SAVE = 'BUFFERED_PATHS_SAVE'
export const BUFFERED_PATHS_SAVE_ERROR = 'BUFFERED_PATHS_SAVE_ERROR'
export const BUFFERED_PATHS_SAVE_SUCCESS = 'BUFFERED_PATHS_SAVE_SUCCESS'

export function appendPath(point) {
  return { type: PATH_APPEND, point }
}

export function endPath(path) {
  return {
    type: PATH_END,
    processed: Bezier.cubicBezierControlPointsFromDataPoints(
      path.sample(PATH_FILTER).toArray()),
  }
}

export function saveBufferedPaths(authToken, buffered) {
  return (dispatch, getState) => {
    dispatch({ type: BUFFERED_PATHS_SAVE })
    return Promise.resolve()
      .then(saveBufferedPathsSuccess)
      .catch(saveBufferedPathsError)
  }
}

export function saveBufferedPathsError() {
  return { type: BUFFERED_PATHS_SAVE_ERROR }
}

export function saveBufferedPathsSuccess() {
  return { type: BUFFERED_PATHS_SAVE_SUCCESS }
}
