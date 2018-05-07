import { combineReducers } from 'redux'
import strokes from './strokes'
import transform from './transform'
import dimensions from './dimensions'
import project from './project'

export default combineReducers({
  strokes,
  transform,
  dimensions,
  project,
})
