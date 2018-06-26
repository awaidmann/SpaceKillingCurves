import React from 'react'

import Submenu from './Submenu'
import ProjectDetails from './ProjectDetails'
import ProjectList from './ProjectList'
import Settings from './Settings'
import { SUBMENUS } from '../defaults/settings'
import { currentProject } from '../utils/currentProject'

const PROJECTS_TITLE = 'Projects'
const SETTINGS_TITLE = 'Settings'

export default class Menu extends React.Component {
  _outlinesFromProps() {
    return Object.values((this.props.config.config || {}).projects || {})
  }

  render() {
    const current = currentProject(this.props.project, this.props.settings) || {}
    return (
      <div className="menu">
        <ProjectDetails
          currentProject={current}
        />
        <Submenu
          title={PROJECTS_TITLE}
          visible={this.props.settings[SUBMENUS][PROJECTS_TITLE]}
          submenu={
            <ProjectList
              projectOutlines={this._outlinesFromProps()}
              currentProject={current}
              onProjectSelect={this.props.onProjectSelect}
            />
          }
          onSubmenuToggle={this.props.onSubmenuToggle.bind(this, PROJECTS_TITLE)}
        />
        <Submenu
          title={SETTINGS_TITLE}
          visible={this.props.settings[SUBMENUS][SETTINGS_TITLE]}
          submenu={
            <Settings
              settings={this.props.settings}
              onUpdateSettings={this.props.onUpdateSettings}
            />
          }
          onSubmenuToggle={this.props.onSubmenuToggle.bind(this, SETTINGS_TITLE)}
        />
      </div>
    )
  }
}
