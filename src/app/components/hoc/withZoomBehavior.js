import React from 'react'
import { zoom } from 'd3-zoom'
import { select, event as d3event } from 'd3-selection'

export default function withZoomBehavior(
  canvasRef,
  onTransform,
  onTransformComplete
) {
  return function(Component) {
    return class extends React.Component {
      constructor(props) {
        super(props)
        this.zoomBehavior = zoom()
        this._handleZoom = this._handleZoom.bind(this)
        this._handleZoomEnd = this._handleZoomEnd.bind(this)
      }

      _handleZoom() {
        onTransform(this.props, d3event.transform)
      }

      _handleZoomEnd() {
        onTransformComplete(this.props)
      }

      componentDidMount() {
        select(canvasRef.current)
          .call(this.zoomBehavior
            .on('zoom', this._handleZoom)
            .on('end', this._handleZoomEnd)
        )
      }

      componentWillUnmount() {
        // TODO: tear down zoom()?
        select(canvasRef.current)
          .on('zoom', null)
          .on('end', null)
      }

      render() {
        return <Component {...this.props} />
      }
    }
  }
}
