import React from 'react'

import Canvas from './Canvas'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.updateWindow = this.updateWindow.bind(this)
    this.state = this._getWindowDimensions()
  }

  _getWindowDimensions() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }

  updateWindow() {
    this.setState(this._getWindowDimensions())
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateWindow)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindow)
  }

  render() {
    return (
      <div>
        <Canvas
          width={this.state.width}
          height={this.state.height}
          />
      </div>
    )
  }
}

export default App
