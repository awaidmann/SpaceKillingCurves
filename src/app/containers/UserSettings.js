import { connect } from 'react-redux'

import { fetchProject } from '../actions/project'
import {
  selectProject,
  updateSettings,
  toggleSubmenu
} from '../actions/settings'
import Menu from '../components/menu'

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => ({
  onProjectSelect: (transform, dimensions, projects) => {
    return (id, title, lastUpdated) => {
      dispatch(selectProject(id, title, lastUpdated))
      projects[id]
        ? console.log('project: ' + id + ' already retrieved')
        : dispatch(fetchProject(id, transform, dimensions))
    }
  },
  onUpdateSettings: settings => dispatch(updateSettings(settings)),
  onSubmenuToggle: submenu => dispatch(toggleSubmenu(submenu))
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return Object.assign({}, ownProps, stateProps, dispatchProps, {
    onProjectSelect: dispatchProps.onProjectSelect(
      stateProps.transform,
      stateProps.dimensions,
      stateProps.project.projects)
  })
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(Menu)
