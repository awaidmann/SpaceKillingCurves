import React from 'react'

import { Canvas } from './Canvas'

export class App extends React.Component {
  render() {
    return (
      <div>
        <Canvas {...this.props} windowRect={{x:0, y:0, width: this.props.width, heigh: this.props.height}} />
      </div>
    )
  }
}
