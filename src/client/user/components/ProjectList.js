import React from 'react'

export default class ProjectList extends React.Component {
  render() {
    return (
      <div>
        <ul>{
          this.props.projectOutlines
            .map(outline =>
              <li key={outline.id}
                  onClick={() => this.props.onProjectSelect(outline.id, outline.title, outline.lastUpdated)}>
                { outline.title }
              </li>)
        }</ul>
      </div>
    )
  }
}
