import React from 'react'

import ProjectDetails from './ProjectDetails'
import ProjectList from './ProjectList'
import Settings from './Settings'
import { currentProject } from '../utils/currentProject'

export default class Menu extends React.Component {
  _outlinesFromProps() {
    return Object.values((this.props.config.config || {}).projects || {})
  }

  render() {
    const current = currentProject(this.props.project, this.props.settings) || {}
    return (
      <div className="menu">
        <div className="submenu">
          <ProjectDetails
            currentProject={current}
          />
          <ProjectList
            projectOutlines={this._outlinesFromProps()}
            currentProject={current}
            onProjectSelect={this.props.onProjectSelect}
          />
        </div>
        <div className="submenu">
          <Settings
            settings={this.props.settings}
            onUpdateSettings={this.props.onUpdateSettings}
          />
        </div>
      </div>
    )
  }
}
