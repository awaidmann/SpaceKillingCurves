import { TRANSFORM } from '../../shared/actions'

const INITIAL_STATE = {
  x: 0,
  y: 0,
  k: 1,
}

function transform(state = INITIAL_STATE, action) {
  switch(action.type) {
    case TRANSFORM:
      return Object.assign({}, state, action.transform)
    default:
      return state
  }
}

export default transform
