import { RESIZE } from '../../shared/actions'

const INITIAL_STATE = {
  width: 0,
  height: 0,
}

function dimensions(state = INITIAL_STATE, action) {
  switch(action.type) {
    case RESIZE:
      return Object.assign({}, state, { width: action.width, height: action.height })
    default:
      return state
  }
}

export default dimensions
