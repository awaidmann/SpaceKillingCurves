import {
  FETCH_STROKES,
  FETCH_STROKES_ERROR,
  FETCH_STROKES_SUCCESS
} from '../../shared/actions'

const INITIAL_STATE = {
  pendingPrefixes: [],
  errors: {},
  strokes: {},
}

function filterPrefix(pending, prefix) {
  return prefix ? pending.filter(p => !(p === prefix)) : pending
}

function strokes(state = INITIAL_STATE, action) {
  switch(action.type) {
    case FETCH_STROKES:
      return Object.assign({}, state, {
        pendingPrefixes: (state.pendingPrefixes || []).concat(action.searchPrefixes),
      })
    case FETCH_STROKES_ERROR:
      return Object.assign({}, state, {
        pendingPrefixes: filterPrefix(state.pendingPrefixes, action.prefix),
        errors: Object.assign({}, state.errors, {
          [action.prefix]: action.error
        })
      })
    case FETCH_STROKES_SUCCESS:
      return Object.assign({}, state, {
        pendingPrefixes: filterPrefix(state.pendingPrefixes, action.prefix),
        strokes: Object.assign({}, state.strokes, {
          [action.prefix]: action.strokes
        })
      })
    default:
      return state
  }
}

export default strokes
