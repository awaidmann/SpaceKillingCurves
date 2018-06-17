import projectDetails from '../../../../data/spk_project.json'
import { prefixes } from '../utils/prefixes'
import { transformComplete } from './transform'
import { fetchTiles } from './tiles'

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
