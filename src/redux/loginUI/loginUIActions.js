import {App, User} from 'parse-lite'
import helpers from '../../utils/helpers'

const app = helpers.parseConnection


export function setInfo(key, value) {

	return (dispatch) => {
		dispatch({type: 'SET_USER_INFO', payload: {key, value}})
	}
}


export function setIsSignup(isSignup) {

	return (dispatch) => {
		dispatch({type: 'SET_IS_SIGNUP', payload: isSignup})
	}
}


export function validateSignup(user, isProvider) {

	return (dispatch) => {

		let isInvalid = false

		const email = user.email.value
		const password = user.password.value
		const username = user.username.value

		if (!helpers.validateEmail(email)) {
			isInvalid = true
			dispatch({type: 'SET_USER_INFO_INVALID', payload: {key: 'email', isInvalid: true}})
		}
		else dispatch({type: 'SET_USER_INFO_INVALID', payload: {key: 'email', isInvalid: false}})

		if (!helpers.validatePassword(password)) {
			isInvalid = true
			dispatch({type: 'SET_USER_INFO_INVALID', payload: {key: 'password', isInvalid: true}})
		}
		else dispatch({type: 'SET_USER_INFO_INVALID', payload: {key: 'password', isInvalid: false}})

		const illegalUsernameChars = /\W/ // allow letters, numbers, and underscores
		if (username.length < 2 || illegalUsernameChars.test(username)) {
			isInvalid = true
			dispatch({type: 'SET_USER_INFO_INVALID', payload: {key: 'username', isInvalid: true}})
		}
		else dispatch({type: 'SET_USER_INFO_INVALID', payload: {key: 'username', isInvalid: false}})

		return new Promise(function(resolve, reject) { resolve(isInvalid) })
	}
}
