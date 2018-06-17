import React from 'react'

import TileLoaderCanvas from '../containers/TileLoaderCanvas'
import UserSettings from '../containers/UserSettings'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.updateWindow = this.updateWindow.bind(this)
  }

  _dimensions() {
    return { width: window.innerWidth, height: window.innerHeight }
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
      <div>
        <div>
          <UserSettings className="menu" />
        </div>
        <div>
          <TileLoaderCanvas />
        </div>
      </div>
    )
  }
}

export default App
