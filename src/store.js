import { applyMiddleware, createStore, compose } from 'redux'
import reducers from './redux'
import {logger} from 'redux-logger'
import thunk from 'redux-thunk'


let middleware = [thunk]
if (process.env.NODE_ENV !== 'production') {
	middleware = [...middleware, logger]
}

export default createStore(
    reducers,
    undefined,
    applyMiddleware(...middleware)
)