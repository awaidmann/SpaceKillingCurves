import { combineReducers } from 'redux'
import strokes from './strokes'
import transform from './transform'
import dimensions from './dimensions'

export default combineReducers({
  strokes,
  transform,
  dimensions,
})
