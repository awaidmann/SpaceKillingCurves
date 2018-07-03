import { combineReducers } from 'redux'

import auth from './auth'
import editor from './editor'
import config from './config'
import settings from './settings'
import tiles from './tiles'
import transform from './transform'
import dimensions from './dimensions'
import search from './search'
import project from './project'

export default combineReducers({
  auth,
  editor,
  config,
  settings,
  tiles,
  transform,
  dimensions,
  project,
  search,
})
