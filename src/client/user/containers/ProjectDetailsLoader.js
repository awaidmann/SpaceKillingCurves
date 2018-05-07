import { connect } from 'react-redux'

import { selectProject, fetchProject } from '../../shared/actions'
import ProjectDetails from '../components/ProjectDetails'

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => ({
  onSelectProject: (hasProjectDetails) => {
    return (id, name) => {
      dispatch(selectProject(id, name))
      if (!hasProjectDetails(id)) dispatch(fetchProject(id))
    }
  }
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return Object.assign({}, ownProps, stateProps, {
    onSelectProject: dispatchProps.onSelectProject(
      (id) => Boolean(stateProps.project.projects[id])
    )
  })
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(ProjectDetails)
