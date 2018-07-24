export default function reducer(state={ 
	notifications: [],
	loading: false,
}, action) {
	switch(action.type) {

		case 'ADD_NOTIFICATION' : {
			let newNotifications = [...state.notifications]
			newNotifications.push(action.payload)
			return {...state, notifications: newNotifications}
		}

		case 'REMOVE_NOTIFICATION' : {
			let newNotifications = [...state.notifications]
			newNotifications.splice(0,1)
			return {...state, notifications: newNotifications}
		}


		default: return state

	}

	return state
}