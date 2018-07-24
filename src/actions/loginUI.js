
export function onChangeField(key, value) {
	return (dispatch) => {
		dispatch({type: 'ON_CHANGE_UI_FIELD', payload: {key, value}})
	}
}

export function setIsSignup(isSignup) {
	return (dispatch) => {
		dispatch({type: 'SET_IS_SIGNUP', payload: isSignup})
	}
}

export function setValidationErrors(field, isError) {
	return (dispatch) => {
		dispatch({type: 'SET_VALIDATION_ERRORS', payload: {field, isError}})
	}
}