import { combineReducers } from 'redux'

import config from './config'
import tiles from './tiles'
import transform from './transform'
import dimensions from './dimensions'
import search from './search'
import project from './project'

export default combineReducers({
  config,
  tiles,
  transform,
  dimensions,
  project,
  search,
})
