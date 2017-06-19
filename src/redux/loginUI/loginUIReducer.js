import update from 'immutability-helper'


export default function reducer(state={
	isSignup: false,
	user: {
		email: {isInvalid: false, value: ''},
		password: {isInvalid: false, value: ''},
		username: {isInvalid: false, value: ''},
	}

}, action) {
	switch(action.type) {

		case "SET_USER_INFO": {

			const key = action.payload.key
			const value = action.payload.value

			return {
				...state, 
				user: update(state.user, {
					[key]: {value: {$set: value}}
				})
			}
		}

		case "SET_USER_INFO_INVALID": {

			const key = action.payload.key
			const isInvalid = action.payload.isInvalid

			return {
				...state, 
				user: update(state.user, {
					[key]: {isInvalid: {$set: isInvalid}}
				})
			}
		}

		case "SET_IS_SIGNUP": {
			return {...state, isSignup: action.payload}
		}

		default: {}

	}

	return state
}