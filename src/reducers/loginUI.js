export default function reducer(state={
	isSignup: false,

	email: '',
	password: '',
	username: '',
	avatarData: null,

	emailError: false,
	passwordError: false,
	usernameError: false,
	avatarError: null,
}, action) {

	const { type, payload } = action

	switch(type) {

		case 'ON_CHANGE_UI_FIELD' : {
			return {...state, [payload.key]: payload.value}
		}
		case 'SET_IS_SIGNUP' : {
			return {...state, isSignup: payload}
		}
		case 'SET_VALIDATION_ERRORS' : {
			return {...state, [payload.field + 'Error']: payload.isError}
		}

		default: {
			return state
		}
	}

	return state
}