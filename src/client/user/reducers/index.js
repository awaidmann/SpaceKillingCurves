import { combineReducers } from 'redux'
import strokes from './strokes'
import transform from './transform'
import dimensions from './dimensions'
import search from './search'
import project from './project'

export default function reducer(state = {}, action) {
  return {
    strokes: strokes(state.strokes, action),
    transform: transform(state.transform, action),
    dimensions: dimensions(state.dimensions, action),
    project: project(state.project, action),
    search: search(state, action),
  }
}
