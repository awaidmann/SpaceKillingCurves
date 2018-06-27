import React from 'react'
import { zoom } from 'd3-zoom'
import { select, event as d3event } from 'd3-selection'

import Draw from '../../utils/Draw'

export default function withZoomBehavior(
  pipelineForUpdate, // pipelineForUpdate(props)
  shouldSetupMouseControls, // shouldSetupMouseControls(props, prevProps)
  onMousemove // onMousemove(event)
) {
  return class extends React.Component {
    constructor(props) {
      super(props)
      this.zoomBehavior = zoom()
      this.canvasRef = React.createRef()

      this._handleZoom = this._handleZoom.bind(this)
      this._handleZoomEnd = this._handleZoomEnd.bind(this)
    }

    _handleZoom() {
      this.props.onTransform(d3event.transform)
    }

    _handleZoomEnd() {
      this.props.onTransformComplete()
    }

    _update() {
      this.drawingCtx.pipeline.apply(
        this.drawingCtx,
        pipelineForUpdate(this.props)
      )({
        x: 0, y: 0,
        width: this.props.dimensions.width,
        height: this.props.dimensions.height
      })(this.props.transform)
    }

    _setupControls(prevProps) {
      const ctrlFlag = shouldSetupMouseControls(this.props, prevProps)
      if (ctrlFlag < 0) {
        this._teardownMouse()
        this._setupZoom()
      } else if (ctrlFlag > 0) {
        this._teardownZoom()
        this._setupMouse()
      } // else do nothing
    }

    _setupZoom() {
      this.canvasSelection
        .call(this.zoomBehavior
          .on('zoom', this._handleZoom)
          .on('end', this._handleZoomEnd)
      )
    }

    _setupMouse() {
      this.canvasSelection.on("mousedown", () => {
        this.canvasSelection.on("mousemove", onMousemove)
      })
      this.canvasSelection.on("mouseup", () => {
        this.canvasSelection.on("mousemove", null)
      })
    }

    _teardownZoom() {
      this.canvasSelection.on('zoom', null)
      this.canvasSelection.on('end', null)
    }

    _teardownMouse() {
      this.canvasSelection.on('mousedown', null)
      this.canvasSelection.on('mousemove', null)
      this.canvasSelection.on('mouseup', null)
    }

    componentDidMount() {
      this.canvasSelection = select(this.canvasRef.current)
      this._setupControls()

      this.drawingCtx = new Draw(this.canvasRef.current.getContext('2d'))
      this._update()
    }

    componentDidUpdate(prevProps) {
      this._setupControls(prevProps)
      this._update()
    }

    componentWillUnmount() {
      this._teardownZoom()
      this._teardownMouse()
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
}
