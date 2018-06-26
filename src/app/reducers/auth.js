import {
  AUTHENTICATING,
  AUTHENTICATION_FAILURE,
  AUTHENTICATION_SUCCESS,
  REVOKE_AUTHENTICATION
} from '../actions/auth'

const INITIAL_STATE = {
  isAuthenticating: false,
  authToken: undefined,
  error: undefined,
}

function auth(state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTHENTICATING:
      return Object.assign({}, state, { isAuthenticating: true })
    case AUTHENTICATION_FAILURE:
      return Object.assign({}, state, { isAuthenticating: false, error: action.error })
    case AUTHENTICATION_SUCCESS:
      return Object.assign({}, state, { isAuthenticating: false, authToken: action.authToken })
    case REVOKE_AUTHENTICATION:
      return INITIAL_STATE
    default:
      return state
  }
}

export default auth
