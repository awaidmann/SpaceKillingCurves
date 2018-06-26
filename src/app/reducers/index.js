import { combineReducers } from 'redux'

import auth from './auth'
import config from './config'
import settings from './settings'
import tiles from './tiles'
import transform from './transform'
import dimensions from './dimensions'
import search from './search'
import project from './project'

export default combineReducers({
  auth,
  config,
  settings,
  tiles,
  transform,
  dimensions,
  project,
  search,
})
