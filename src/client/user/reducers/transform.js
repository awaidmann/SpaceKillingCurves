import { PAN, ZOOM, RESIZE } from '../../shared/actions'

const INITIAL_STATE = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  scale: 1
}

function transform(state = INITIAL_STATE, action) {
  switch(action.type) {
    case PAN:
      return Object.assign({}, state, { x: action.x, y: action.y })
    case ZOOM:
      return Object.assign({}, state, { scale: action.scale })
    case RESIZE:
      return Object.assign({}, state, { width: action.width, height: action.height })
    default:
      return state
  }
}

export default transform
