import {
  SELECT_PROJECT,
  UPDATE_SETTINGS,
  TOGGLE_SUBMENU
} from '../actions/settings'
import {
  PROJECT,
  SUBMENUS,
  DEFAULT_SETTINGS
} from '../defaults/settings'

function settings(state = DEFAULT_SETTINGS, action) {
  switch(action.type) {
    case SELECT_PROJECT:
      return Object.assign({}, state, {
        [PROJECT]: { id: action.id, title: action.title, lastUpdated: action.lastUpdated }
      })
    case UPDATE_SETTINGS:
      return Object.assign({}, state, action.settings)
    case TOGGLE_SUBMENU:
      return Object.assign({}, state, {
        [SUBMENUS]: Object.assign({}, state[SUBMENUS], {
          [action.submenu]: !state[SUBMENUS][action.submenu]
        })
      })
    default:
      return state
  }
}

export default settings
