import { RESIZE } from '../actions/transform'

const INITIAL_STATE = {
  width: 0,
  height: 0,
}

function dimensions(state = INITIAL_STATE, action) {
  switch(action.type) {
    case RESIZE:
      return Object.assign({}, state, action.dimensions)
    default:
      return state
  }
}

export default dimensions
