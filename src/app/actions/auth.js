export const AUTHENTICATING = 'AUTHENTICATING'
export const AUTHENTICATION_SUCCESS = 'AUTHENTICATION_SUCCESS'
export const AUTHENTICATION_FAILURE = 'AUTHENTICATION_FAILURE'
export const REVOKE_AUTHENTICATION = 'REVOKE_AUTHENTICATION'

export function authenticate(credentials) {
  return (dispatch, getState) => {
    dispatch({ type: AUTHENTICATING })
    return Promise.resolve(credentials)
      .then(authToken => dispatch(authenticationSuccess(authToken)))
      .catch(error => dispatch(authenticationFailure(error)))
  }
}

export function authenticationFailure(error) {
  return { type: AUTHENTICATION_FAILURE, error }
}

export function authenticationSuccess(authToken) {
  return { type: AUTHENTICATION_SUCCESS, authToken }
}

export function revokeAuthentication() {
  return { type: REVOKE_AUTHENTICATION, timestamp: Date.now() }
}
