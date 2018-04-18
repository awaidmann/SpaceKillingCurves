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

export const PAN = 'PAN'
export const ZOOM = 'ZOOM'
export const RESIZE = 'RESIZE'

export const FETCH_STROKES = 'FETCH_STROKES'
export const FETCH_STROKES_ERROR = 'FETCH_STROKES_ERROR'
export const FETCH_STROKES_SUCCESS = 'FETCH_STROKES_SUCCESS'

export function pan(x, y) {
  return { type: PAN, x, y }
}

export function zoom(scale) {
  return { type: ZOOM, scale }
}

export function resize(width, height) {
  return { type: RESIZE, width, height }
}

export function fetchStrokes(strokePrefixes) {
  return { type: FETCH_STROKES, strokePrefixes }
}

export function fetchStrokesError(error) {
  return errorAction(FETCH_STROKES_ERROR, error)
}

export function fetchStrokesSuccess(strokes) {
  return successAction(FETCH_STROKES_SUCCESS, strokes)
}
