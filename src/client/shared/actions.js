import beziers from '../../../data/spk_bezier_data.json'
import projectDetails from '../../../data/spk_project.json'

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

export function selectProject(id, title) {
  return { type: SELECT_PROJECT, id, title }
}

export function fetchProject(id) {
  return (dispatch, getState) => {
    dispatch({ type: FETCH_PROJECT, id })
    return Promise.resolve(projectDetails)
      .then(resp => dispatch(fetchProjectSuccess(id, resp)))
      .catch(error => dispatch(fetchProjectError(id, error)))
  }
}

export function fetchProjectError(id, error) {
  return { type: FETCH_PROJECT_ERROR, id, error }
}

export function fetchProjectSuccess(id, project) {
  return { type: FETCH_PROJECT_SUCCESS, id, project }
}

// Data viewport/retrieval actions/functions

export const TRANSFORM = 'TRANSFORM'
export const RESIZE = 'RESIZE'

export const FETCH_STROKES = 'FETCH_STROKES'
export const FETCH_STROKES_ERROR = 'FETCH_STROKES_ERROR'
export const FETCH_STROKES_SUCCESS = 'FETCH_STROKES_SUCCESS'

export function transform(newTransform, prevTransform, searchPrefixes) {
  // TODO: check if new transform is sufficiently different from prevTransform to initiate fetch
  return fetchStrokes(searchPrefixes, { type: TRANSFORM, transform: newTransform })
}

export function resize(newDimensions, prevDimensions, searchPrefixes) {
  const resizeAction = { type: RESIZE, dimensions: newDimensions }
  return newDimensions.width <= prevDimensions.width
    && newDimensions.height <= prevDimensions.height
    ? resizeAction
    : fetchStrokes(searchPrefixes, resizeAction)
}

// TODO: handle pagination
export function fetchStrokes(searchPrefixes, intialAction) {
  return (dispatch, getState) => {
    if (intialAction) dispatch(intialAction)
    dispatch({ type: FETCH_STROKES, searchPrefixes })
    // TODO: connect to data source methods
    return Promise.all(
      searchPrefixes.map(prefix => {
        const filtered = beziers.filter(b => b.morton.startsWith(prefix))
        return filtered.length
          ? Promise.resolve(filtered)
            .then(resp => dispatch(fetchStrokesSuccess(prefix, resp)))
            .catch(error => dispatch(fetchStrokesError(prefix, error)))
          : Promise.resolve()
      }))
  }
}

export function fetchStrokesError(prefix, error) {
  return { type: FETCH_STROKES_ERROR, prefix, error }
}

export function fetchStrokesSuccess(prefix, strokes) {
  return { type: FETCH_STROKES_SUCCESS, prefix, strokes }
}
