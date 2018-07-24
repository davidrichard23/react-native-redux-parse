import {AsyncStorage} from 'react-native'
import {App, User, Ops, Save, Query, Cloud} from 'parse-lite'
import Parse from 'parse/react-native'
import { NavigationActions } from 'react-navigation'
import helpers from '../utils/helpers'
import config from '../utils/config'


const app = new App({
  host: config.host, 
  applicationId: config.appId, 
})


export function getCurrentUser() {

	return (dispatch) => {

		dispatch({type: 'GET_USER'})

		let sessionToken = null

		return AsyncStorage.getItem('sessionToken')
		.then((result) => {
			if (result){
				sessionToken = result
				return Query.find(app, '_User', {}, {sessionToken: sessionToken})
			}
		})
		.then((results) => {
			if (results && results.length > 0) {
				const user = results[0]
				const userPointer = helpers.createParsePointer(user.objectId, '_User')

				const query = Query.equalTo({}, 'user', userPointer)
				return Query.find(app, 'Profile', query)
				.then(profiles => {
					const profile = profiles[0]
					AsyncStorage.setItem('sessionToken', sessionToken)
					dispatch({type: 'GET_USER_FULFILLED', payload: {sessionToken, user, profile}})
				})
			}
			else
				dispatch({type: 'GET_USER_FULFILLED', payload: {}})
		})
		.catch((error) => {
			helpers.handleParseError(error, dispatch)
			dispatch({type: 'GET_USER_REJECTED', payload: error})
		})
	}
}


export function login(username, password) {

	return (dispatch) => {

		dispatch({type: 'USER_LOGIN'})
		username = username.toLowerCase()

		let user, sessionToken

		return User.logIn(app, {username, password})
		.then((auth) => {
			sessionToken = auth.sessionToken
			user = auth.user
			// set the user on the official Parse SDK for the few times it is needed (LiveQueries, Saving Files)
			return Parse.User.become(sessionToken)
		})
		.then(() => {
			AsyncStorage.setItem('sessionToken', sessionToken)
			dispatch({type: 'USER_LOGIN_FULFILLED', payload: {user: user, sessionToken: sessionToken}})

			return user
		})
		.catch((error) => {
			helpers.handleParseError(error, dispatch)
			dispatch({type: 'USER_LOGIN_REJECTED', payload: error})
		})
	}
}


export function signup(signupData) {

	return (dispatch, getState) => {

		let user = null
		let sessionToken = null

		const email = signupData.email
		const password = signupData.password
		const username = signupData.username

		dispatch({type: 'USER_SIGNUP'})

		return User.signUp(app, {email: email, username: username, password: password})
		.then((auth) => {
			user = auth.user
			sessionToken = auth.sessionToken

			// update the user ACL, 
			const userAcl = {[user.objectId]: {read: true, write: true}}
			let updatedUser = Ops.set(user, {ACL: userAcl})
			return Save(app, '_User', updatedUser, {sessionToken})
		})
		.then((result) => {
			// set the user on the official Parse SDK for the few times it is needed (LiveQueries, Saving Files)
			return Parse.User.become(sessionToken)
		})
		.then(() => {
			AsyncStorage.setItem('sessionToken', sessionToken)
			dispatch({type: 'USER_SIGNUP_FULFILLED', payload: {user, sessionToken}})
		})
		.catch((error) => {
			helpers.handleParseError(error, dispatch)
			dispatch({type: 'USER_SIGNUP_REJECTED', payload: error})
		})
	}
}


export function createProfile(signupData) {

	return (dispatch, getState) => {

		const state = getState()
		const sessionToken = state.user.sessionToken
		const user = state.user.user

		dispatch({type: 'CREATE_PROFILE'})

		const file = new Parse.File("avatar.jpg", {base64: signupData.avatarData}, "image/jpeg");
		return file.save()
		.then(response => {
			// remove data that shouldn't be stored in the profile object and add the user pointer
			delete signupData.password
			delete signupData.email
			delete signupData.avatarData
			signupData.user = helpers.createParsePointer(user.objectId, '_User')

			const profileAcl = {[user.objectId]: {read: true, write: true}, ['*']: {read: true, write: false}}
			signupData.avatar = response.toJSON()
			signupData.ACL = profileAcl

			return Save(app, 'Profile', signupData, {sessionToken})
		})
		.then(response => {
			dispatch({type: 'CREATE_PROFILE_FULFILLED', payload: response})
		})
		.catch((error) => {
			helpers.handleParseError(error, dispatch)
			dispatch({type: 'CREATE_PROFILE_REJECTED', payload: error})
		})
	}
}


export function logout() {

  return function(dispatch, getState) {

  	const state = getState()
  	const sessionToken = state.user.sessionToken
    AsyncStorage.removeItem('sessionToken')
    dispatch({type: 'LOGOUT'})
    dispatch(NavigationActions.navigate({ routeName: 'Login'}))

    // logout of the official Parse SDK
    return Parse.User.logOut()
		// logout of Parse-lite
    .then(() => User.logOut(app, sessionToken))
  }
}



export function resendVerification(email) {

  return function(dispatch, getState) {

		alert('Open the "src/actions/user.js" file, search for the "resendVerification" function, and then add the commented function to your parse server cloud code. After this is done, you can delete this alert')
		return

  	/*/////////////////////////////////////////////////////////////////////////////////////////
  	/////////////////// Add this function to your parse server cloud code ///////////////////
  	/////////////////////////////////////////////////////////////////////////////////////////

			  	Parse.Cloud.define('resendEmailVerification', function(req, res) {

			  		var user = req.user
			  		if (!user) {res.error('Not logged in'); return;}
			  		var sessionToken = user.getSessionToken()

			  		var params = req.params
			  		var email = params.email

			  		user.set("email", email);
			  		user.save(null, {sessionToken})
			  		.then((results) => {
			  			res.success(results)
			  		})
			  		.catch((error) => {
			  			res.error(error)
			  		})
			  	})

		/////////////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////////////*/



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
