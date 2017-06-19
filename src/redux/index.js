import { combineReducers } from 'redux'
import user from './user/userReducer'
import loginUI from './loginUI/loginUIReducer'
import app from './app/appReducer'


export default function getRootReducer(navReducer) {
  return combineReducers({
    nav: navReducer,
    user: user,
		loginUI: loginUI,
		app: app,
  });
}
