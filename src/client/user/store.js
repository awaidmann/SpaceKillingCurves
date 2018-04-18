import { createStore, combineReducers, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import * as reducers from './reducers'

const storePromise = new Promise((resolve) => {
  resolve(
    createStore(
      reducers,
      {},
      applyMiddleware(ReduxThunk)
  ))
}

export default storePromise
