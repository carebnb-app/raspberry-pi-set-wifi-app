import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import promise from 'redux-promise-middleware'
import reducers from './reducers'

const middlewares = applyMiddleware(promise, logger)
const store = createStore(reducers, middlewares)

export default store
