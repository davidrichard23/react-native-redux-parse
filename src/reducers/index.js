import { combineReducers } from 'redux'
import user from './user'
import app from './app'
import loginUI from './loginUI'

const reducers = combineReducers({
  user,
	app,
	loginUI,
})

export default reducers
