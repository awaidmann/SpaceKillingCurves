import { combineReducers } from 'redux'
import tiles from './tiles'
import transform from './transform'
import dimensions from './dimensions'
import search from './search'
import project from './project'

export default combineReducers({
  tiles,
  transform,
  dimensions,
  project,
  search,
})
