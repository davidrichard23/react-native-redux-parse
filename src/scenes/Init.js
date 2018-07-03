import React, {Component} from 'react'
import { connect } from 'react-redux'
import { NavigationActions, StackActions } from 'react-navigation';
import * as userActions from '../redux/user/userActions'
import colors from '../utils/colors.json'


@connect((store) => {
  return {
    user: store.user.user,
  }
})
export default class Init extends Component {

	componentWillMount() {
		this.getCurrentUser()
	}

	render() {
		return null
	}

	getCurrentUser() {

		this.props.dispatch(userActions.getCurrentUser())
		.then(() => {
			this.chooseInitialRoute()
		}).done()
	}


	chooseInitialRoute() {

		const {navigation, user} = this.props
		const isNew = user && !user.email

		if (!user || isNew) 
			navigation.dispatch(StackActions.reset({ index: 0, key: null, actions: [NavigationActions.navigate({routeName: 'Modal'})]}))
		else if (!user.emailVerified) {
			navigation.dispatch(StackActions.reset({ index: 0, key: null, actions: [NavigationActions.navigate({routeName: 'Modal'})]}))
			navigation.dispatch(StackActions.reset({ index: 0, actions: [NavigationActions.navigate({routeName: 'UnverifiedEmail'})]}))
		}
    else
			navigation.dispatch(StackActions.reset({ index: 0, key: null, actions: [NavigationActions.navigate({routeName: 'Home'})]}))
	}
}