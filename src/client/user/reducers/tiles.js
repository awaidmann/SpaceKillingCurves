import {
  FETCH_TILES,
  FETCH_TILES_ERROR,
  FETCH_TILES_SUCCESS
} from '../../shared/actions'

const INITIAL_STATE = {
  pendingPrefixes: [],
  errors: {},
  tiles: {},
}

function filterPrefix(pending, prefix) {
  return prefix ? pending.filter(p => !(p === prefix)) : pending
}

function tiles(state = INITIAL_STATE, action) {
  switch(action.type) {
    case FETCH_TILES:
      return Object.assign({}, state, {
        pendingPrefixes: (state.pendingPrefixes || []).concat(action.searchPrefixes),
      })
    case FETCH_TILES_ERROR:
      return Object.assign({}, state, {
        pendingPrefixes: filterPrefix(state.pendingPrefixes, action.prefix),
        errors: Object.assign({}, state.errors, {
          [action.prefix]: action.error
        })
      })
    case FETCH_TILES_SUCCESS:
      return Object.assign({}, state, {
        pendingPrefixes: filterPrefix(state.pendingPrefixes, action.prefix),
        tiles: Object.assign({}, state.tiles, {
          [action.prefix]: action.tiles
        })
      })
    default:
      return state
  }
}

export default tiles
