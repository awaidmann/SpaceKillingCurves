import React from 'react'
import { zoom } from 'd3-zoom'
import { select, event as d3event } from 'd3-selection'

import Draw from '../utils/Draw'
import { rectsForQuadrantPrefixes } from '../utils/prefixes'
import { currentProject } from '../utils/currentProject'
import { TILES_VISIBLE } from '../defaults/settings'

class Canvas extends React.Component {
  constructor(props) {
    super(props)
    this.zoomBehavior = zoom()

    this.canvasRef = React.createRef()
    this._handleZoom = this._handleZoom.bind(this)
    this._handleEnd = this._handleEnd.bind(this)
    this._windowRectFromProps = this._windowRectFromProps.bind(this)
  }

  _windowRectFromProps() {
    return { x: 0, y: 0, width: this.props.dimensions.width, height: this.props.dimensions.height }
  }

  _handleZoom() {
    this.props.onTransform(d3event.transform)
  }

  _handleEnd() {
    this.props.onTransformComplete()
  }

  _tilesFromProps() {
    return this.props.tiles.cache.getFromKeys(this.props.search.viewPrefixes)
  }

  _searchRectsFromProps() {
    return rectsForQuadrantPrefixes(
      this.props.search.viewPrefixes,
      currentProject(this.props.project, this.props.settings)
    )
  }

  _drawingPipelineForSettings() {
    return [
      Draw.tiles(this._tilesFromProps()),
      this.props.settings[TILES_VISIBLE] ? Draw.boundingRects(this._searchRectsFromProps()) : undefined
    ]
  }

  componentDidMount() {
    this.canvasSelection = select(this.canvasRef.current)
      .call(this.zoomBehavior
        .on('zoom', this._handleZoom)
        .on('end', this._handleEnd)
      )
    this.drawingCtx = new Draw(this.canvasRef.current.getContext('2d'))
    this.drawingCtx.pipeline.apply(
      this.drawingCtx,
      this._drawingPipelineForSettings()
    )(this._windowRectFromProps())()
  }

  componentDidUpdate() {
    this.drawingCtx.pipeline.apply(
      this.drawingCtx,
      this._drawingPipelineForSettings()
    )(this._windowRectFromProps())(this.props.transform)
  }

  componentWillUnmount() {
    this.canvasSelection.on('zoom', null)
    this.canvasSelection.on('end', null)
  }

  render() {
    return (
      <div>
        <canvas
          ref={this.canvasRef}
          height={this.props.dimensions.height}
          width={this.props.dimensions.width}
        />
      </div>
    )
  }
}

export default Canvas
