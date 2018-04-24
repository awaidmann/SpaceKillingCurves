import { TRANSFORM, RESIZE } from '../../shared/actions'

const INITIAL_STATE = {
  x: 0,
  y: 0,
  k: 1,
  width: 0,
  height: 0,
}

function transform(state = INITIAL_STATE, action) {
  switch(action.type) {
    case TRANSFORM:
      return Object.assign({}, state, { x: action.x, y: action.y, k: action.k })
    case RESIZE:
      return Object.assign({}, state, { width: action.width, height: action.height })
    default:
      return state
  }
}

export default transform
