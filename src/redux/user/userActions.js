import {AsyncStorage} from 'react-native'
import {App, User, Ops, Save, Query, Cloud} from 'parse-lite'
import Parse from 'parse/react-native'
import { NavigationActions } from 'react-navigation'
import helpers from '../../utils/helpers'
import config from '../../../config'

const app = new App({
  host: config.host, 
  applicationId: config.appId, 
})


export function getCurrentUser() {

	return (dispatch) => {

		dispatch({type: 'SET_USER_LOADING', payload: true})

		let auth = null

		return AsyncStorage.getItem('auth')
		.then((result) => {
			if (result){
				auth = JSON.parse(result)
				return checkExpiredSession(auth.sessionToken, dispatch)
			}
			else
				dispatch({type: 'SET_USER_LOADING', payload: false})
		})
		.then((isValid) => {
			if (isValid) {
				AsyncStorage.setItem('auth', JSON.stringify(auth))
				dispatch({type: 'SET_USER_AUTH', payload: auth})
			}
			else
				dispatch({type: 'SET_USER_LOADING', payload: false})
		})
		.catch((error) => {
			helpers.handleParseError(error, dispatch)
		})
	}
}



export function login(username, password) {

	return (dispatch) => {

		dispatch({type: 'USER_LOGIN'})
		username = username.toLowerCase()

		return User.logIn(app, {username, password})
		.then((auth) => {
			// set the user on the official Parse SDK for the few times it is needed (LiveQueries, Saving Files)
			return Parse.User.become(auth.sessionToken)
			.then(() => {
				AsyncStorage.setItem('auth', JSON.stringify(auth))
				dispatch({type: 'USER_LOGIN_FULFILLED', payload: {user: auth.user, sessionToken: auth.sessionToken}})

				return auth.user
			})
		})
		.catch((error) => {
			helpers.handleParseError(error, dispatch)
			dispatch({type: 'USER_LOGIN_REJECTED', payload: error})
		})
	}
}


export function signup(info) {

	return (dispatch, getState) => {

		let user = null
		let sessionToken = null

		const email = info.email.value.toLowerCase()
		const password = info.password.value
		const username = info.username.value.toLowerCase()

		dispatch({type: 'USER_SIGNUP'})

		return User.signUp(app, {email: email, username: username, password: password})
		.then((auth) => {
			user = auth.user
			sessionToken = auth.sessionToken

			// set the user on the official Parse SDK for the few times it is needed (LiveQueries, Saving Files)
			return Parse.User.become(auth.sessionToken)
		})
		.then(() => {
			// update the user ACL
			const acl = {[user.objectId]: {read: true, write: true}}
			let updatedUser = Ops.set(user, {ACL: acl})

			return Save(app, '_User', updatedUser, {sessionToken})
		})
		.then((result) => {
			user = result
			const auth = {user, sessionToken}
			AsyncStorage.setItem('auth', JSON.stringify(auth))
			dispatch({type: 'USER_SIGNUP_FULFILLED', payload: auth})
			return result
		})
		.catch((error) => {
			helpers.handleParseError(error, dispatch)
			dispatch({type: 'USER_SIGNUP_REJECTED', payload: error})
		})
	}
}


export function logout() {

  return function(dispatch, getState) {

  	const state = getState()
  	const sessionToken = state.user.sessionToken
    AsyncStorage.removeItem('auth')
    dispatch({type: 'SET_USER_AUTH', payload: {user: null, sessionToken: null}})
    dispatch(NavigationActions.navigate({ routeName: 'Login'}))

    // logout of the official Parse SDK
    return Parse.User.logOut()
		// logout of Parse-lite
    .then(() => User.logOut(app, sessionToken))
  }
}



export function resendVerification(email) {

  return function(dispatch, getState) {

		dispatch({type: 'RESEND_EMAIL_VERIFICATION'})

  	const state = getState()
  	const sessionToken = state.user.sessionToken
    
    return Cloud(app, 'resendEmailVerification', {email}, {sessionToken})
    .then((result) => {
			dispatch({type: 'RESEND_EMAIL_VERIFICATION_FULFILLED'})
		})
		.catch((error) => {
			helpers.handleParseError(error, dispatch)
			dispatch({type: 'RESEND_EMAIL_VERIFICATION_REJECTED', payload: error})
		})
  }
}


// LiveQuery bug doesnt allow this to work - submitted issue to Github
export function listenForEmailVerification() {

  return function(dispatch, getState) {

  	const state = getState()
  	const sessionToken = state.user.sessionToken

  	const userObjectId = state.user.user.objectId
  	let query = new Parse.Query(Parse.User);
  	query.equalTo('objectId', userObjectId)
  	query.equalTo('emailVerified', true)
		const subscription = query.subscribe();

		subscription.on('enter', (object) => {
		  console.log('updated');
		 	dispatch({type: 'EMAIL_VERIFICATION_FULFILLED'})
		  subscription.unsubscribe();
		});

		subscription.on('open', () => {
		  console.log('opened');
		});

		subscription.on('close', () => {
		  console.log('closed');
		});
  }
}



export function checkEmailVerification() {

  return function(dispatch, getState) {

  	const state = getState()
  	const sessionToken = state.user.sessionToken

  	const userObjectId = state.user.user.objectId
  	let q = Query.equalTo({}, 'objectId', userObjectId)
  	q = Query.equalTo(q, 'emailVerified', true)
		return Query.find(app, '_User', q, {sessionToken})
		.then((results) => {
			if (results.length > 0) {
				const newAuth = {user: results[0], sessionToken: state.user.sessionToken}
				AsyncStorage.setItem('auth', JSON.stringify(newAuth))
				dispatch({type: 'EMAIL_VERIFICATION_FULFILLED'})
				return true
			}
			else return false
		})
		.catch((error) => {
			helpers.handleParseError(error, dispatch)
		})
  }
}














//////////////// helpers ///////////////////////



function checkExpiredSession(sessionToken, dispatch) {

	const q = Query.limit({}, 10)

	return Query.find(app, 'Session', q, {sessionToken})
	.then((result) => {
		return true
	})
	.catch((error) => {
		helpers.handleParseError(error, dispatch)
		return false
	})
}

