import { connect } from 'react-redux'
import React from 'react'

import with2DCanvas from '../components/hoc/with2DCanvas'
import withZoomBehavior from '../components/hoc/withZoomBehavior'

import Draw from '../utils/Draw'
import { prefixes, rectsForQuadrantPrefixes } from '../utils/prefixes'
import { currentProject } from '../utils/currentProject'
import { Point } from '../geometry'

import { transform, transformComplete } from '../actions/transform'
import { fetchTiles } from '../actions/tiles'
import { appendPath, endPath } from '../actions/path'

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
  },

  onPathAppend: (point) => dispatch(appendPath(point)),
  onPathEnd: (path, transform) => {
    return (point) => {
      dispatch(endPath(path.add(point).invert(transform)))
    }
  }
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return Object.assign({}, ownProps, stateProps, dispatchProps, {
    onTransformComplete: dispatchProps.onTransformComplete(
      stateProps.transform,
      stateProps.dimensions,
      currentProject(stateProps.project, stateProps.settings)),
    onPathEnd: dispatchProps.onPathEnd(
      stateProps.path.current,
      stateProps.transform),
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
      : undefined,
    Draw.path(props.path.current.invert(props.transform)),
    Draw.cubicBeziers(props.path.pending.reduce((acc, x) => acc.concat(x), []))
    // draw other admin stuff
  ]
}

const canvasRef = React.createRef()

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(
  withZoomBehavior(
    canvasRef,
    (props, e) => {
      if (props.editor.isEditing) {
        props.onPathAppend(Point.fromEvent(canvasRef.current, e))
      } else {
        props.onTransform(e.transform)
      }},
    (props, e) => {
      if (props.editor.isEditing) {
        props.onPathEnd(Point.fromEvent(canvasRef.current, e))
      } else {
        props.onTransformComplete()
      }
    },
    (props, prevProps) => {
      if (!props.editor.isEditing && prevProps.editor.isEditing) {
        return props.transform
      }
    }
  )(
    with2DCanvas(
      canvasRef,
      pipelineForUpdate
    )(function EditorCanvas(props) {
        return (<div>{ props.canvas }</div>)
      }
    )))
