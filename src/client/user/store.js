import { createStore, combineReducers, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import * as reducers from './reducers'

const INITIAL_STATE = {
  
}

const storePromise = new Promise((resolve) => {
  resolve(
    createStore(
      combineReducers(reducers),
      INITIAL_STATE,
      applyMiddleware(ReduxThunk)
    ))
}

export default storePromise
