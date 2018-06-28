import React from 'react'

import Draw from '../../utils/Draw'

export default function with2DCanvas(
  canvasRef,
  pipelineForUpdate // pipelineForUpdate(props)
) {
  return function(Component) {
    return class extends React.Component {
      _update() {
        const { dimensions, transform } = this.props
        this.drawingCtx.pipeline.apply(
          this.drawingCtx,
          pipelineForUpdate(this.props)
        )({
          x: 0, y: 0,
          width: dimensions.width,
          height: dimensions.height
        })(transform)
      }

      componentDidMount() {
        this.drawingCtx = new Draw(canvasRef.current.getContext('2d'))
        this._update()
      }

      componentDidUpdate() {
        this._update()
      }

      render() {
        const { dimensions } = this.props
        const canvas = (
          <div>
            <canvas
              ref={canvasRef}
              height={dimensions.height}
              width={dimensions.width}
              />
          </div>)
        return (
          <Component canvas={canvas} {...this.props} />
        )
      }
    }
  }
}
