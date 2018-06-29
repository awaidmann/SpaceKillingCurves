import { connect } from 'react-redux'
import React from 'react'

import with2DCanvas from '../components/hoc/with2DCanvas'
import withZoomBehavior from '../components/hoc/withZoomBehavior'

import Draw from '../utils/Draw'
import { prefixes, rectsForQuadrantPrefixes } from '../utils/prefixes'
import { currentProject } from '../utils/currentProject'

import { transform, transformComplete } from '../actions/transform'
import { fetchTiles } from '../actions/tiles'

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

const canvasRef = React.createRef()

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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(
  withZoomBehavior(
    canvasRef,
    (props, e) => props.onTransform(e.transform),
    (props) => props.onTransformComplete()
  )(
    with2DCanvas(
      canvasRef,
      pipelineForUpdate
    )(
      function TileLoaderCanvas(props) {
        return (<div>{ props.canvas }</div>)
      }
    )))
