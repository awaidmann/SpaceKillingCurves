import {
  PATH_APPEND,
  PATH_END,
  PATH_SAVE
} from '../actions/path'
import { Path } from '../geometry'

const INITIAL_STATE = new Path()

export default function path(state = INITIAL_STATE, action) {
  switch(action.type) {
    case PATH_APPEND:
      return state.add(action.point)
    case PATH_END:
      return new Path()
    case PATH_SAVE:
    default:
      return state
  }
}
