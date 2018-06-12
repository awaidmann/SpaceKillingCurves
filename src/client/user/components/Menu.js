import React from 'react'

import ProjectDetails from './ProjectDetails'
import ProjectList from './ProjectList'
import { currentProject } from '../utils/currentProject'

export default class Menu extends React.Component {
  _outlinesFromProps() {
    return Object.values((this.props.config.config || {}).projects || {})
  }

  render() {
    return (
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
    )
  }
}
