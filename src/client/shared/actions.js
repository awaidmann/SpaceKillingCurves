import beziers from '../../../data/spk_bezier_data.json'

// Generic data retrieval action creators

function errorAction(type, error) {
  return { type, error }
}

function successAction(type, data) {
  return { type, data }
}

// Config retrieval actions/functions

export const FETCH_CONFIG = 'FETCH_CONFIG'
export const FETCH_CONFIG_ERROR = 'FETCH_CONFIG_ERROR'
export const FETCH_CONFIG_SUCCESS = 'FETCH_CONFIG_SUCCESS'

export function fetchConfig() {
  return { type: FETCH_CONFIG }
}

export function fetchConfigError(error) {
  return errorAction(FETCH_CONFIG_ERROR, error)
}

export function fetchConfigSuccess(config) {
  return successAction(FETCH_CONFIG_SUCCESS, config)
}

// Project selection/retrieval actions/functions

export const SELECT_PROJECT = 'SELECT_PROJECT'

export const FETCH_PROJECT = 'FETCH_PROJECT'
export const FETCH_PROJECT_ERROR = 'FETCH_PROJECT_ERROR'
export const FETCH_PROJECT_SUCCESS = 'FETCH_PROJECT_SUCCESS'

export function selectProject(projectID) {
  return { type: SELECT_PROJECT, projectID }
}

export function fetchProject(projectID) {
  return { type: FETCH_PROJECT, projectID }
}

export function fetchProjectError(error) {
  return errorAction(FETCH_PROJECT_ERROR, error)
}

export function fetchProjectSuccess(project) {
  return successAction(FETCH_PROJECT_SUCCESS, project)
}

// Data viewport/retrieval actions/functions

export const TRANSFORM = 'TRANSFORM'
export const RESIZE = 'RESIZE'

export const FETCH_STROKES = 'FETCH_STROKES'
export const FETCH_STROKES_ERROR = 'FETCH_STROKES_ERROR'
export const FETCH_STROKES_SUCCESS = 'FETCH_STROKES_SUCCESS'

export function transform(newTransform, prevTransform) {
  // TODO: check if new transform is sufficiently different from prevTransform to initiate fetch
  return fetchStrokes(["1"], { type: TRANSFORM, transform: newTransform })
}

export function resize(newDimensions, prevDimensions) {
  // TODO: check if new dimensions are sufficiently different from prevDimensions to initiate fetch
  return fetchStrokes(["1"], { type: RESIZE, dimensions: newDimensions })
}

// TODO: handle pagination
export function fetchStrokes(searchPrefixes, intialAction) {
  return (dispatch, getState) => {
    if (intialAction) dispatch(intialAction)
    dispatch({ type: FETCH_STROKES, searchPrefixes })
    // TODO: connect to data source methods
    return Promise.all(
      searchPrefixes.map(prefix => {
        Promise.resolve(beziers)
          .then(resp => dispatch(fetchStrokesSuccess(prefix, resp)))
          .catch(error => dispatch(fetchStrokesError(prefix, error)))
      }))
  }
}

export function fetchStrokesError(prefix, error) {
  return { type: FETCH_STROKES_ERROR, prefix, error }
}

export function fetchStrokesSuccess(prefix, strokes) {
  return { type: FETCH_STROKES_SUCCESS, prefix, strokes }
}
