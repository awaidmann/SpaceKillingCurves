import { connect } from 'react-redux'

import { prefixes } from '../utils/prefixes'
import { resize, transformComplete, fetchStrokes } from '../../shared/actions'
import App from '../components/App'

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => ({
  onResize: (transform, project) => {
    return (width, height) => {
      const dimensions = { width, height }
      dispatch(resize(dimensions))

      const searchPrefixes = prefixes(transform, dimensions, project)
      dispatch(transformComplete(transform, dimensions, searchPrefixes))
      dispatch(fetchStrokes(searchPrefixes))
    }
  }
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return Object.assign({}, ownProps, stateProps, {
    onResize: dispatchProps.onResize(stateProps.transform, stateProps.project)
  })
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(App)
