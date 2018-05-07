import React from 'react'
import { zoom } from 'd3-zoom'
import { select, event as d3event } from 'd3-selection'

import Draw from '../../shared/Draw'

class Canvas extends React.Component {
  constructor(props) {
    super(props)
    this.zoomBehavior = zoom()

    this.canvasRef = React.createRef()
    this._handleZoom = this._handleZoom.bind(this)
    this._windowRectFromProps = this._windowRectFromProps.bind(this)
  }

  _windowRectFromProps() {
    return { x: 0, y: 0, width: this.props.dimensions.width, height: this.props.dimensions.height }
  }

  _handleZoom() {
    this.props.onTransform(d3event.transform)
  }

  _beziersFromProps() {
    return this.props.search.viewPrefixes
      .reduce((acc, pre) => {
        return acc.concat(this.props.strokes.strokes[pre] || [])
      }, [])
  }

  componentDidMount() {
    this.canvasSelection = select(this.canvasRef.current)
      .call(this.zoomBehavior.on('zoom', this._handleZoom))
    this.drawingCtx = new Draw(this.canvasRef.current.getContext('2d'))
    this.drawingCtx.cubicBeziers(this._beziersFromProps())(this._windowRectFromProps())()
  }

  componentDidUpdate() {
    this.drawingCtx.cubicBeziers(this._beziersFromProps())(this._windowRectFromProps())(this.props.transform)
  }

  componentWillUnmount() {
    this.canvasSelection.on('zoom', null)
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
