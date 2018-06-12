import React from 'react'

import ProjectDetails from './ProjectDetails'
import { currentProject } from '../utils/currentProject'

export default class Menu extends React.Component {
  _projectsFromProps() {
    return this.props.config.config
      ? Object.values(this.props.config.config.projects)
        .map(project =>
          <li key={project.id}
            onClick={() => this.props
              .onSelectProject(project.id, project.title, project.lastUpdated)}>
            { project.title }
          </li>)
      : []
  }

  render() {
    return (
      <div>
        <div>
          <ul>{ this._projectsFromProps() }</ul>
        </div>
        <ProjectDetails
          currentProject={
            currentProject(this.props.project, this.props.settings) || {}
          }
        />
      </div>
    )
  }
}
