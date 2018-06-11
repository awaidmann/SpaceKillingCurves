import React from 'react'

export default class ProjectDetails extends React.Component {
  render() {
    return (
      <div>
        <span>{this.props.currentProject.title} ({ this.props.currentProject.id })</span>
      </div>
    )
  }
}
