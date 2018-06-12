import { connect } from 'react-redux'

import {
  fetchProject,
  selectProject
} from '../../shared/actions'
import Menu from '../components/Menu'

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => ({
  onProjectSelect: (transform, dimensions, projects) => {
    return (id, title, lastUpdated) => {
      dispatch(selectProject(id, title, lastUpdated))
      projects[id]
        ? console.log('project: ' + id + ' already retrieved')
        : dispatch(fetchProject(id, transform, dimensions))
    }
  }
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
