import { combineReducers } from 'redux'
import user from './user/userReducer'
import app from './app/appReducer'

const reducers = combineReducers({
  user: user,
	app: app,
})

export default reducers
