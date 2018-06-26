export const SELECT_PROJECT = 'SELECT_PROJECT'
export const UPDATE_SETTINGS = 'UPDATE_SETTINGS'
export const TOGGLE_SUBMENU = 'TOGGLE_SUBMENU'

export function selectProject(id, title, lastUpdated) {
  return { type: SELECT_PROJECT, id, title, lastUpdated }
}

export function updateSettings(settings) {
  return { type: UPDATE_SETTINGS, settings }
}

export function toggleSubmenu(submenu) {
  return { type: TOGGLE_SUBMENU, submenu }
}
