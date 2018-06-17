import config from '../../../data/spk_app_config.json'
import { fetchProject } from './project'
import { selectProject } from './settings'

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
