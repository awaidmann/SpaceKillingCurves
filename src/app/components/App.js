import React from 'react'

import TileLoaderCanvas from '../containers/TileLoaderCanvas'
import UserSettings from '../containers/UserSettings'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()
    this.updateWindow = this.updateWindow.bind(this)
  }

  _dimensions() {
    return {
      width: this.canvasRef.current.clientWidth,
      height: this.canvasRef.current.clientHeight
    }
  }

  updateWindow() {
    this.props.onResize(this._dimensions())
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateWindow)
    this.updateWindow()
    this.props.onAppLoad(this._dimensions())
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindow)
  }

  render() {
    return (
      <div className="container-fluid app">
        <div className="row">
          <div className="col-sm-4 col-lg-3">
            <UserSettings />
          </div>
          <div
            ref={this.canvasRef}
            className="col-sm-8 col-lg-9"
          >
            <TileLoaderCanvas />
          </div>
        </div>
      </div>
    )
  }
}

export default App
