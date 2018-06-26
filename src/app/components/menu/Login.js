import React from 'react'

export default class Login extends React.Component {
  render() {
    return (
      <div>
        <button
          type="button"
          className="btn btn-primary btn-sm btn-block"
          onClick={this.props.onAuthenticate}
        >
          Login
        </button>
      </div>
    )
  }
}
