import {
  FETCH_TILES,
  FETCH_TILES_ERROR,
  FETCH_TILES_SUCCESS
} from '../actions/tiles'
import QueryCache from '../utils/QueryCache'

const INITIAL_STATE = {
  pendingPrefixes: [],
  errors: {},
  // TODO: setup cache params with project specific details
  cache: new QueryCache(
    [], [],
    (x) => x ? x.morton : "2",
    (a, b) => b.startsWith(a) ? 0 : b < a ? 1 : -1,
    undefined
  )
}

function filterPrefix(pending, prefix) {
  return prefix ? pending.filter(p => !(p === prefix)) : pending
}

function tiles(state = INITIAL_STATE, action) {
  switch(action.type) {
    case FETCH_TILES:
      return Object.assign({}, state, {
        pendingPrefixes: (state.pendingPrefixes || [])
          .concat(action.searchPrefixes.filter(p => !state.cache.has(p))),
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
        cache: state.cache.add(action.prefix, action.tiles)
      })
    default:
      return state
  }
}

export default tiles
