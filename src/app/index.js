import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import ResizeableApp from './containers/ResizeableApp'
import store from './store'

import 'bootstrap/dist/css/bootstrap.min.css'
import './style/main.css'

render(
  <Provider store={store}>
    <ResizeableApp />
  </Provider>,
  document.getElementById('react')
)
