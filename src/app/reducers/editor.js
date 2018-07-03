import {
  EDIT_MODE_BEGIN,
  EDIT_MODE_END
} from '../actions/editor'

const INITIAL_STATE = {
  isEditing: true
}

function editor(state = INITIAL_STATE, action) {
  switch(action.type) {
    case EDIT_MODE_BEGIN:
      return Object.assign({}, state, { isEditing: true })
    case EDIT_MODE_END:
      return Object.assign({}, state, { isEditing: false })
    default:
      return state
  }
}

export default editor
