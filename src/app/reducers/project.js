import {
  FETCH_PROJECT,
  FETCH_PROJECT_ERROR,
  FETCH_PROJECT_SUCCESS
} from '../actions/project'

const INITIAL_STATE = {
  fetching: undefined,
  projects: {}
}

function isFetchingStatus(state, action) {
  return (state.fetching && state.fetching == action.id) ? undefined : state.fetching
}

function project(state = INITIAL_STATE, action) {
  switch(action.type) {
    case FETCH_PROJECT:
      return Object.assign({}, state, { fetching: action.id })
    case FETCH_PROJECT_SUCCESS:
      return Object.assign({}, state, {
        fetching: isFetchingStatus(state, action),
        projects: Object.assign({}, state.projects, { [action.id]: action.project })
      })
    case FETCH_PROJECT_ERROR:
      return Object.assign({}, state, {
        fetching: isFetchingStatus(state, action),
        projects: Object.assign({}, state.projects, { [action.id]: action.error })
      })
    default:
      return state
  }
}

export default project
