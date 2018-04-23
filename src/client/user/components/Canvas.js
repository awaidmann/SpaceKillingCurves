import React from 'react'
import { zoom } from 'd3-zoom'
import { select, event as d3event } from 'd3-selection'

import { Draw } from '../../shared/Draw'

export class Canvas extends React.Component {
  constructor(props) {
    super(props)
    this.zoomBehavior = zoom()

    this.canvasRef = React.createRef()
    this.handleZoom = this.handleZoom.bind(this)

    this.state = {}
  }

  componentDidMount() {
    this.canvasSelection = select(this.canvasRef.current)
      .call(this.zoomBehavior.on('zoom', this.handleZoom))
    this.drawingCtx = new Draw(this.canvasRef.current.getContext('2d'))
    this.drawingCtx.cubicBeziers(this.props.beziers)(this.props.windowRect)()
  }

  componentDidUpdate() {
    this.drawingCtx.cubicBeziers(this.props.beziers)(this.props.windowRect)(this.state.transform)
  }

  componentWillUnmount() {
    this.canvasSelection.on('zoom', null)
  }

  handleZoom() {
    console.log(d3event)
    this.setState({ transform: d3event.transform })
  }

  render() {
    return (
      <div>
        <canvas
          ref={this.canvasRef}
          height={this.props.height}
          width={this.props.width}
        />
      </div>
    )
  }
}
