import React from 'react'
import { render } from 'react-dom'

import { App } from './components/App'

const style = {
  width: window.screen.availWidth,
  height: window.screen.availHeight,
}

render(
  <App {...style} />,
  document.getElementById('react')
)
