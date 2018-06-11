import {
  FETCH_CONFIG,
  FETCH_CONFIG_ERROR,
  FETCH_CONFIG_SUCCESS
} from '../../shared/actions'

const INITIAL_STATE = {
  isFetching: false,
  config: undefined,
  error: undefined,
}

function config(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_CONFIG:
      return Object.assign({}, state, { isFetching: true })
    case FETCH_CONFIG_ERROR:
      return Object.assign({}, state, { isFetching: false, error: action.error })
    case FETCH_CONFIG_SUCCESS:
      return Object.assign({}, state, { isFetching: false, config: action.config })
    default:
      return state
  }
}

export default config
