import { List } from 'immutable'
import {
  PATH_APPEND,
  PATH_END,
  BUFFERED_PATHS_SAVE,
  BUFFERED_PATHS_SAVE_ERROR,
  BUFFERED_PATHS_SAVE_SUCCESS
} from '../actions/path'
import { Path } from '../geometry'

const INITIAL_STATE = {
  current: new Path(),
  pending: List()
}

export default function path(state = INITIAL_STATE, action) {
  switch(action.type) {
    case PATH_APPEND:
      return Object.assign({}, state, {
        current: state.current.add(action.point)
      })
    case PATH_END:
      return Object.assign({}, state, {
        current: new Path(),
        pending: state.pending.push(action.processed)
      })
    case BUFFERED_PATHS_SAVE:
    case BUFFERED_PATHS_SAVE_ERROR:
    case BUFFERED_PATHS_SAVE_SUCCESS:
    default:
      return state
  }
}
