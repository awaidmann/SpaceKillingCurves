import {
  SELECT_PROJECT,
  UPDATE_SETTINGS
} from '../../shared/actions'

const INITIAL_STATE = {
  project: {},
}

function settings(state = INITIAL_STATE, action) {
  switch(action.type) {
    case SELECT_PROJECT:
      return Object.assign({}, state, {
        project: { id: action.id, title: action.title, lastUpdated: action.lastUpdated }
      })
    case UPDATE_SETTINGS:
      return Object.assign({}, state, action.settings)
    default:
      return state
  }
}

export default settings
