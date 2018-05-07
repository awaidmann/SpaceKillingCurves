import { TRANSFORM_COMPLETE } from '../../shared/actions'

const INITIAL_STATE = {
  viewPrefixes: []
}

function search(state = INITIAL_STATE, action) {
  switch(action.type) {
    case TRANSFORM_COMPLETE:
      return Object.assign({}, state, { viewPrefixes: action.viewPrefixes })
    default:
      return state
  }
}

export default search
