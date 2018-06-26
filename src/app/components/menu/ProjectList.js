import React from 'react'

export default class ProjectList extends React.Component {
  render() {
    return (
      <div>
        <ul className="list-group">{
          this.props.projectOutlines
            .map(outline =>
              <li key={outline.id}
                  className={ "list-group-item " + (this.props.currentProject.id == outline.id ? 'active' : '') }
                  onClick={() => this.props.onProjectSelect(outline.id, outline.title, outline.lastUpdated)}>
                { outline.title }
              </li>)
        }</ul>
      </div>
    )
  }
}
