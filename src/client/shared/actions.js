import tiles from '../../../data/spk_mixed_data.json'
import config from '../../../data/spk_app_config.json'
import projectDetails from '../../../data/spk_project.json'
import { prefixes } from '../user/utils/prefixes'
// Config retrieval actions/functions

export const FETCH_CONFIG = 'FETCH_CONFIG'
export const FETCH_CONFIG_ERROR = 'FETCH_CONFIG_ERROR'
export const FETCH_CONFIG_SUCCESS = 'FETCH_CONFIG_SUCCESS'

export function fetchConfig(transform, dimensions) {
  return (dispatch, getState) => {
    dispatch({ type: FETCH_CONFIG })
    return Promise.resolve(config)
      .then(resp => {
        dispatch(fetchConfigSuccess(resp))
        const outline = resp.projects[resp.default] || {}
        dispatch(selectProject(outline.id, outline.title, outline.lastUpdated))
        dispatch(fetchProject(resp.default, transform, dimensions))
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

export function selectProject(id, title, lastUpdated) {
  return { type: SELECT_PROJECT, id, title, lastUpdated }
}

export const FETCH_PROJECT = 'FETCH_PROJECT'
export const FETCH_PROJECT_ERROR = 'FETCH_PROJECT_ERROR'
export const FETCH_PROJECT_SUCCESS = 'FETCH_PROJECT_SUCCESS'

export function fetchProject(id, transform, dimensions) {
  return (dispatch, getState) => {
    dispatch({ type: FETCH_PROJECT, id })
    return Promise.resolve(projectDetails)
      .then(resp => {
        dispatch(fetchProjectSuccess(id, resp))
        const searchPrefixes = prefixes(transform, dimensions, resp)
        dispatch(transformComplete(transform, dimensions, searchPrefixes))
        dispatch(fetchTiles(searchPrefixes))
      })
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


// settings
export const UPDATE_SETTINGS = 'UPDATE_SETTINGS'

export function updateSettings(settings) {
  return { type: UPDATE_SETTINGS, settings }
}
