import React from 'react'

import BezierLoaderCanvas from '../containers/BezierLoaderCanvas'

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
        <BezierLoaderCanvas />
      </div>
    )
  }
}

export default App
