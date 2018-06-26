import React from 'react'

export default class Submenu extends React.Component {
  render() {
    return (
      <div className="submenu">
        <a className="submenu-title" onClick={this.props.onSubmenuToggle}>
          { this.props.title }
        </a>
        {
          this.props.visible
            ? <div className="submenu-content">{ this.props.submenu }</div>
            : null
        }
      </div>
    )
  }
}
