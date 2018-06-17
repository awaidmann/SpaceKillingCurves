import { connect } from 'react-redux'

import { prefixes } from '../utils/prefixes'
import { currentProject } from '../utils/currentProject'
import { resize, transformComplete } from '../actions/transform'
import { fetchConfig } from '../actions/config'
import { fetchTiles } from '../actions/tiles'
import App from '../components/App'

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => ({
  onAppLoad: (transform) => {
    return (dimensions) => dispatch(fetchConfig(transform, dimensions))
  },
  onResize: (transform, project) => {
    return (dimensions) => {
      dispatch(resize(dimensions))

      const searchPrefixes = prefixes(transform, dimensions, project)
      dispatch(transformComplete(transform, dimensions, searchPrefixes))
      dispatch(fetchTiles(searchPrefixes))
    }
  }
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return Object.assign({}, ownProps, stateProps, {
    onAppLoad: dispatchProps.onAppLoad(stateProps.transform, stateProps.dimensions),
    onResize: dispatchProps.onResize(
      stateProps.transform,
      currentProject(stateProps.project, stateProps.settings))
  })
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(App)
