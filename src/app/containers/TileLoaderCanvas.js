import { connect } from 'react-redux'

import withZoomBehavior from '../components/hoc/withZoomBehavior'

import { prefixes } from '../utils/prefixes'
import { currentProject } from '../utils/currentProject'
import { transform, transformComplete } from '../actions/transform'
import { fetchTiles } from '../actions/tiles'

import Draw from '../utils/Draw'
import { rectsForQuadrantPrefixes } from '../utils/prefixes'
import { TILES_VISIBLE } from '../defaults/settings'

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
      stateProps.transform,
      stateProps.dimensions,
      currentProject(stateProps.project, stateProps.settings)),
  })
}

const pipelineForUpdate = (props) => {
  return [
    Draw.tiles(props.tiles.cache
      .getFromKeys(props.search.viewPrefixes)),
    props.settings[TILES_VISIBLE]
      ? Draw.boundingRects(
          rectsForQuadrantPrefixes(
            props.search.viewPrefixes,
            currentProject(props.project, props.settings)
          ))
      : undefined
  ]
}

const shouldSetupMouseControls = () => -1

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(withZoomBehavior(
  pipelineForUpdate,
  shouldSetupMouseControls
))
