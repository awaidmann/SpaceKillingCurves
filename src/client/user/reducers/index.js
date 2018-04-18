import { combineReducers } from 'redux'
import strokes from './strokes'
import transform from './transform'

export default combineReducers({
  strokes,
  transform
})
