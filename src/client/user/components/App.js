import React from 'react'

import TileLoaderCanvas from '../containers/TileLoaderCanvas'
import AppConfigurationLoader from '../containers/AppConfigurationLoader'
import ProjectDetailsLoader from '../containers/ProjectDetailsLoader'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.updateWindow = this.updateWindow.bind(this)
  }

  updateWindow() {
    this.props.onResize(window.innerWidth, window.innerHeight)
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateWindow)
    this.updateWindow()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindow)
  }

  render() {
    return (
      <div>
        <div>
          <AppConfigurationLoader className="menu" />
        </div>
        <div>
          <ProjectDetailsLoader />
          <TileLoaderCanvas />
        </div>
      </div>
    )
  }
}

export default App
