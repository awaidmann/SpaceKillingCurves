import React from 'react'

export default class Login extends React.Component {
  render() {
    const isAuthed = Boolean(this.props.auth.authToken)
    return (
      <div>
        <button
          type="button"
          className="btn btn-primary btn-sm btn-block"
          onClick={
            isAuthed
              ? this.props.onRevokeAuthentication
              : this.props.onAuthenticate
            }
        >
          { isAuthed ? 'Logout' : 'Login' }
        </button>
      </div>
    )
  }
}
