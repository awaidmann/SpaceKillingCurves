import { connect } from 'react-redux'
import { compose } from 'redux'
import React from 'react'
import { selection } from 'd3-selection'

import with2DCanvas from '../components/hoc/with2DCanvas'
import withZoomBehavior from '../components/hoc/withZoomBehavior'
import withKeyPressBehavior from '../components/hoc/withKeyPressBehavior'

import Draw from '../utils/Draw'
import { prefixes, rectsForQuadrantPrefixes } from '../utils/prefixes'
import { currentProject } from '../utils/currentProject'
import { Point } from '../geometry'

import { transform, transformComplete } from '../actions/transform'
import { fetchTiles } from '../actions/tiles'
import { beginEditMode, endEditMode } from '../actions/editor'
import { appendPath, endPath, savePath } from '../actions/path'

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

  onEditModeBegin: () => dispatch(beginEditMode()),
  onEditModeEnd: () => dispatch(endEditMode()),

  onPathAppend: (point) => dispatch(appendPath(point)),
  onPathEnd: (authToken, path, transform) => {
    return (point) => {
      dispatch(endPath())
      dispatch(savePath(path.add(point).invert(transform), authToken))
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
      stateProps.auth.authToken,
      stateProps.path,
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
    Draw.path(props.path),
    // draw other admin stuff
  ]
}

const canvasRef = React.createRef()

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(
  withKeyPressBehavior(
    (props, e) => props.onEditModeEnd(),
    (props, e) => props.onEditModeBegin(),
    (props, e) => e.key === 'Meta' // cmd
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
      ))))
