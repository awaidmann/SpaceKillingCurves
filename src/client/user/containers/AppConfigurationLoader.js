import { connect } from 'react-redux'

import {
  fetchConfig,
  fetchProject,
  selectProject
} from '../../shared/actions'
import Menu from '../components/Menu'

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => ({
  onAppLoad: () => dispatch(fetchConfig()),
  onSelectProject: (projects) => {
    return (id, title, lastUpdated) => {
      dispatch(selectProject(id, title, lastUpdated))
      projects[id]
        ? console.log('project: ' + id + ' already retrieved')
        : dispatch(fetchProject(id))
    }
  }
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return Object.assign({}, ownProps, stateProps, dispatchProps, {
    onSelectProject: dispatchProps.onSelectProject(stateProps.project.projects)
  })
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(Menu)
