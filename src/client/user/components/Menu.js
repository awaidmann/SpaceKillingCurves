import React from 'react'

export default class Menu extends React.Component {
  componentDidMount() {
    this.props.onAppLoad()
  }

  _projectsFromProps() {
    return this.props.config.config
      ? this.props.config.config.projects
        .map(project =>
          <li key={project.id}
            onClick={() => this.props.onSelectProject(project.id)}>
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
      </div>
    )
  }
}
