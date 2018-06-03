import { connect } from 'react-redux'

import { prefixes } from '../utils/prefixes'
import { transform, transformComplete, fetchTiles } from '../../shared/actions'
import Canvas from '../components/Canvas'

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => ({
  onTransform: (newTransform) => dispatch(transform(newTransform)),
  onTransformComplete: (transform, dimensions, project) => {
    return () => {
      const searchPrefixes = prefixes(transform, dimensions, project)
      dispatch(transformComplete(transform, dimensions, searchPrefixes))
      dispatch(fetchTiles(searchPrefixes))
    }
  }
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return Object.assign({}, ownProps, stateProps, dispatchProps, {
    onTransformComplete: dispatchProps.onTransformComplete(
      stateProps.transform, stateProps.dimensions, stateProps.project),
  })
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(Canvas)
