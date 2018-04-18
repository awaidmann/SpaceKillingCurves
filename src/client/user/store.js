import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import * as reducers from './reducers'

const store = createStore(
  reducers,
  {},
  applyMiddleware(ReduxThunk)
)

export default store
