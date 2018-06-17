import {
  SELECT_PROJECT,
  UPDATE_SETTINGS
} from '../../shared/actions'
import { PROJECT, DEFAULT_SETTINGS } from '../defaults/settings'

function settings(state = DEFAULT_SETTINGS, action) {
  switch(action.type) {
    case SELECT_PROJECT:
      return Object.assign({}, state, {
        [PROJECT]: { id: action.id, title: action.title, lastUpdated: action.lastUpdated }
      })
    case UPDATE_SETTINGS:
      return Object.assign({}, state, action.settings)
    default:
      return state
  }
}

export default settings
