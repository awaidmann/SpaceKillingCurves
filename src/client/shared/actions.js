import tiles from '../../../data/spk_mixed_data.json'
import config from '../../../data/spk_app_config.json'
import projectDetails from '../../../data/spk_project.json'

// Config retrieval actions/functions

export const FETCH_CONFIG = 'FETCH_CONFIG'
export const FETCH_CONFIG_ERROR = 'FETCH_CONFIG_ERROR'
export const FETCH_CONFIG_SUCCESS = 'FETCH_CONFIG_SUCCESS'

export function fetchConfig() {
  return (dispatch, getState) => {
    dispatch({ type: FETCH_CONFIG })
    return Promise.resolve(config)
      .then(resp => {
        dispatch(fetchConfigSuccess(resp))
        dispatch(fetchProject(resp.default))
      })
      .catch(error => dispatch(fetchConfigError(error)))
  }
}

export function fetchConfigError(error) {
  return { type: FETCH_CONFIG_ERROR, error }
}

export function fetchConfigSuccess(config) {
  return { type: FETCH_CONFIG_SUCCESS, config }
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
export const TRANSFORM_COMPLETE = 'TRANSFORM_COMPLETE'

export const FETCH_TILES = 'FETCH_TILES'
export const FETCH_TILES_ERROR = 'FETCH_TILES_ERROR'
export const FETCH_TILES_SUCCESS = 'FETCH_TILES_SUCCESS'

export function transform(transform) {
  return { type: TRANSFORM, transform }
}

export function resize(dimensions) {
  return { type: RESIZE, dimensions }
}

export function transformComplete(transform, dimensions, viewPrefixes) {
  return { type: TRANSFORM_COMPLETE, transform, dimensions, viewPrefixes }
}

// TODO: handle pagination
export function fetchTiles(searchPrefixes) {
  return (dispatch, getState) => {
    dispatch({ type: FETCH_TILES, searchPrefixes })
    // TODO: connect to data source methods
    return Promise.all(
      searchPrefixes.map(prefix => {
        const filtered = tiles.filter(b => b.morton.startsWith(prefix))
        return filtered.length
          ? Promise.resolve(filtered)
            .then(resp => dispatch(fetchTilesSuccess(prefix, resp)))
            .catch(error => dispatch(fetchTilesError(prefix, error)))
          : Promise.resolve()
      }))
  }
}

export function fetchTilesError(prefix, error) {
  return { type: FETCH_TILES_ERROR, prefix, error }
}

export function fetchTilesSuccess(prefix, tiles) {
  return { type: FETCH_TILES_SUCCESS, prefix, tiles }
}
