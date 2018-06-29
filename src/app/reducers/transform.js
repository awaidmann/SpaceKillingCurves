import { zoomIdentity } from 'd3-zoom'
import { TRANSFORM } from '../actions/transform'

const INITIAL_STATE = zoomIdentity

function transform(state = INITIAL_STATE, action) {
  switch(action.type) {
    case TRANSFORM:
      return Object.assign({}, state, action.transform)
    default:
      return state
  }
}

export default transform
