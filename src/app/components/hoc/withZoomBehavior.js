import React from 'react'
import { zoom, zoomIdentity } from 'd3-zoom'
import { select, event as d3event } from 'd3-selection'

export default function withZoomBehavior(
  canvasRef,
  onTransform,
  onTransformComplete,
  transformTo
) {
  return function(Component) {
    return class extends React.Component {
      constructor(props) {
        super(props)
        this.zoomBehavior = zoom()

        this._handleZoom = () => onTransform
          ? onTransform(this.props, d3event)
          : undefined
        this._handleZoomEnd = () => onTransformComplete
          ? onTransformComplete(this.props)
          : undefined
      }

      componentDidMount() {
        select(canvasRef.current)
          .call(this.zoomBehavior
            .on('zoom', this._handleZoom)
            .on('end', this._handleZoomEnd)
          )
      }

      componentDidUpdate(prevProps) {
        const to = transformTo
          ? transformTo(this.props, prevProps)
          : undefined
        if (to) {
          select(canvasRef.current)
            .call(this.zoomBehavior.transform,
              zoomIdentity.translate(to.x, to.y).scale(to.k))
        }
      }

      componentWillUnmount() {
        select(canvasRef.current)
          .on('.zoom', null)
          .on('.end', null)
      }

      render() {
        return <Component {...this.props} />
      }
    }
  }
}
