import {AsyncStorage} from 'react-native'
import {App, User, Ops, Save, Query, Cloud} from 'parse-lite'
import Parse from 'parse/react-native'
import { NavigationActions } from 'react-navigation'
import helpers from '../../utils/helpers'
import config from '../../../config'

const FBSDK = require('react-native-fbsdk');
const {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} = FBSDK;


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
				AsyncStorage.setItem('sessionToken', sessionToken)
				dispatch({type: 'GET_USER_FULFILLED', payload: {sessionToken, user: results[0]}})
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



export function facebookLogin(data) {

	return (dispatch) => {

		dispatch({type: 'USER_LOGIN'})

    let authData = {
      authData: {
        id: data.userID,
        access_token: data.accessToken
	    }
    };

		return Parse.User.logInWith('facebook', authData)
		.then((user) => {
			user = user.toJSON()
			const sessionToken = user.sessionToken
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



export function fetchFacebookProfileData() {

	return (dispatch) => {

		dispatch({type: 'FETCH_FB_PROFILE_DATA'})

    const infoRequest = new GraphRequest(
      '/me?fields=id,first_name,picture.type(large),birthday,gender,email',
      null,
      (error, result) => {
      	if (error) {
  				dispatch({type: 'FETCH_FB_PROFILE_DATA_REJECTED', payload: error})
  				return
      	}

  			dispatch({type: 'FETCH_FB_PROFILE_DATA_FULFILLED', payload: result})
      }
    )
    new GraphRequestManager().addRequest(infoRequest).start()
	}
}



export function login(username, password) {

	return (dispatch) => {

		dispatch({type: 'USER_LOGIN'})
		username = username.toLowerCase()

		let sessionToken = null
		let user = null

		return User.logIn(app, {username, password})
		.then((auth) => {
			// set the user on the official Parse SDK for the few times it is needed (LiveQueries, Saving Files)
			sessionToken = auth.sessionToken
			user = auth.user
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


export function signup(data) {

	return (dispatch, getState) => {

		let user = null
		let sessionToken = null

		const email = data.email
		const password = data.password
		const username = data.username

		dispatch({type: 'USER_SIGNUP'})

		return User.signUp(app, {email: email, username: username, password: password})
		.then((auth) => {
			user = auth.user
			sessionToken = auth.sessionToken

			// set the user on the official Parse SDK for the few times it is needed (LiveQueries, Saving Files)
			return Parse.User.become(auth.sessionToken)
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


export function createProfile(data) {

	return (dispatch, getState) => {


		const state = getState()
		const sessionToken = state.user.sessionToken
		const user = {objectId: state.user.user.objectId}

		let profile = {
			firstName: data.firstName,
			username: data.username,
			gender: data.gender,
			dob: data.dob,
		}

		dispatch({type: 'CREATE_PROFILE'})

		// update the user ACL
		const userAcl = {[user.objectId]: {read: true, write: true}}
		let updatedUser = Ops.set(user, {ACL: userAcl})
		updatedUser = Ops.set(updatedUser, {username: data.username})
		updatedUser = Ops.set(updatedUser, {email: data.email})

		return Save(app, '_User', updatedUser, {sessionToken})
		.then((result) => {
			const file = new Parse.File("image.jpg", {base64: data.avatar}, "image/jpeg");
			return file.save()
		})
		.then(response => {
			const profileAcl = {[user.objectId]: {read: true, write: true}, ['*']: {read: true, write: false}}
			profile.avatar = response.toJSON()
			profile.ACL = profileAcl

			return Save(app, 'Profile', profile, {sessionToken})
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

    LoginManager.logOut()

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

