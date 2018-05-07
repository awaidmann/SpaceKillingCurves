import React from 'react'

export default class ProjectDetails extends React.Component {
  componentDidMount() {
    this.props.onSelectProject('1234567890', 'Test Project')
  }

  render() {
    return (
      <div>
        <span>{this.props.project.current.title} ({ this.props.project.current.id })</span>
      </div>
    )
  }
}
