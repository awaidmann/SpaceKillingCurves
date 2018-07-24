import { List } from 'immutable'
import {
  PATH_APPEND,
  PATH_END,
  PATH_SAVE
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
    case PATH_SAVE:
    default:
      return state
  }
}
