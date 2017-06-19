import { applyMiddleware, createStore, compose } from 'redux'
import getRootReducer from './redux/index.js'
import {logger} from 'redux-logger'
import thunk from 'redux-thunk'


let middleware = [thunk]
if (process.env.NODE_ENV !== 'production') {
	middleware = [...middleware, logger]
}


// export default createStore(reducer, applyMiddleware(...middleware))

export default function getStore(navReducer) {
    const store = createStore(
        getRootReducer(navReducer),
        undefined,
        applyMiddleware(...middleware)
    );

    return store;
}