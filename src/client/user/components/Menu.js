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
    return (
      <div>
        <div>
          <ProjectDetails
            currentProject={
              currentProject(this.props.project, this.props.settings) || {}
            }
          />
          <ProjectList
            projectOutlines={this._outlinesFromProps()}
            onProjectSelect={this.props.onProjectSelect}
          />
        </div>
        <div>
          <Settings
            settings={this.props.settings}
            onUpdateSettings={this.props.onUpdateSettings}
          />
        </div>
      </div>
    )
  }
}
