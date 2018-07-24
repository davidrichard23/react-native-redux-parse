import React, {Component} from 'react'
import { connect } from 'react-redux'
import { NavigationActions, StackActions } from 'react-navigation';
import {getCurrentUser} from '../actions/user'
import {addNotification} from '../actions/app'


class Init extends Component {

	componentWillMount() {
		this.getCurrentUser()
	}

	render() {
		return null
	}

	getCurrentUser() {
		this.props.dispatch(getCurrentUser())
		.then(() => {
			this.chooseInitialRoute()
		}).done()
	}


	chooseInitialRoute() {

		const {navigation, user} = this.props

		if (!user) 
			navigation.dispatch(StackActions.reset({ index: 0, key: null, actions: [NavigationActions.navigate({routeName: 'Modal'})]}))
		else if (!user.emailVerified)
			navigation.dispatch(StackActions.reset({ index: 0, key: null, actions: [NavigationActions.navigate({routeName: 'Modal', action: NavigationActions.navigate({routeName: 'UnverifiedEmail'})})]}))
    else
			navigation.dispatch(StackActions.reset({ index: 0, key: null, actions: [NavigationActions.navigate({routeName: 'Home'})]}))
	}
}


export default connect((store) => {
  return {
    user: store.user.user,
  }
}, null)(Init)