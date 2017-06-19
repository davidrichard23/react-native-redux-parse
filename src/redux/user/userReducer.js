import update from 'immutability-helper'


export default function reducer(state={
	user: null,
	sessionToken: null,
	loading: false,
	error: null,
}, action) {
	switch(action.type) {

		case 'SET_USER_AUTH' : {
			const user = action.payload.user
			const sessionToken = action.payload.sessionToken
			return {...state, user: user, sessionToken: sessionToken, loading: false}
		}


		case 'USER_LOGIN' : {
			return {...state, loading: true}
		}
		case 'USER_LOGIN_FULFILLED' : {
			const user = action.payload.user
			const sessionToken = action.payload.sessionToken
			return {...state, loading: false, user, sessionToken}
		}
		case 'USER_LOGIN_REJECTED' : {
			return {...state, loading: false, error: action.payload}
		}


		case 'USER_SIGNUP' : {
			return {...state, loading: true}
		}
		case 'USER_SIGNUP_FULFILLED' : {

			const user = action.payload.user
			const sessionToken = action.payload.sessionToken

			return {...state, loading: false, user: user, sessionToken: sessionToken}
		}
		case 'USER_SIGNUP_REJECTED' : {
			return {...state, loading: false, error: action.payload}
		}



		case 'RESEND_EMAIL_VERIFICATION' : {
			return {...state, loading: true}
		}
		case 'RESEND_EMAIL_VERIFICATION_FULFILLED' : {
			return {...state, loading: false}
		}
		case 'RESEND_EMAIL_VERIFICATION_REJECTED' : {
			return {...state, loading: false, error: action.payload}
		}


		case 'EMAIL_VERIFICATION_FULFILLED' : {
			const newUser = update(state.user, {emailVerified: {$set: true}})
			return {...state, user: newUser}
		}


		case 'SET_USER_LOADING' : {
			return {...state, loading: action.payload}
		}



		default: {}

	}

	return state
}