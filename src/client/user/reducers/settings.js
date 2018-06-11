import {
  SELECT_PROJECT
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
    default:
      return state
  }
}

export default settings
