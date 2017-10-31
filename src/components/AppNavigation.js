import React, { Component } from 'react'
import { View, Button } from 'react-native'
import { Provider, connect } from 'react-redux'
import getStore from '../store'

import { StackNavigator, addNavigationHelpers, NavigationActions } from 'react-navigation';
import * as userActions from '../redux/user/userActions'
import Loader from '../components/Loader'
import DismissableStackNavigator from '../components/DismissableStackNavigator'
import colors from '../utils/colors.json'
import Notifications from '../components/Notifications'


import Home from '../scenes/Home'
import Login from '../scenes/Login'
import UnverifiedEmail from '../scenes/UnverifiedEmail'



// Wrap Redux
export default class App extends Component {

	render() {

		return (
			<Provider store={store}>
				<View style={{flex: 1}}>
					<AppNavigation />
					<Notifications />
				</View>
			</Provider>
		)
	}
}

// Wrap Root Navigator
@connect((store) => {
	return {
		nav: store.nav,
		loading: store.user.loading || store.app.loading,
	}
})
class AppNavigation extends Component {

	render() {

		return (
			<View style={{flex: 1}}>
				<RootNavigator navigation={addNavigationHelpers({
	        dispatch: this.props.dispatch,
	        state: this.props.nav,
	      })} />

	      {this.props.loading &&
					<Loader fullScreen />
				}
	     </View>
		)
	}
}



// Decide whether to show login screen or home
@connect((store) => {
  return {
  	nav: store.nav,
    user: store.user.user,
  }
})
class Init extends Component {

	componentWillMount() {
		this.getCurrentUser()
	}

	render() {

		return <Loader fullScreen={true} />
	}

	getCurrentUser() {

		this.props.dispatch(userActions.getCurrentUser())
		.then(() => {
			this.chooseInitialRoute()
		}).done()
	}


	chooseInitialRoute() {

		const isNew = this.props.user && !this.props.user.email === true

		if (!this.props.user || isNew) 
			this.props.navigation.dispatch(NavigationActions.reset({ index: 0, key: null, actions: [NavigationActions.navigate({routeName: 'Modal'})]}))
		else if (!this.props.user.emailVerified) {
			this.props.navigation.dispatch(NavigationActions.reset({ index: 0, key: null, actions: [NavigationActions.navigate({routeName: 'Modal'})]}))
			this.props.navigation.dispatch(NavigationActions.reset({ index: 0, actions: [NavigationActions.navigate({routeName: 'UnverifiedEmail'})]}))
		}
    else
			this.props.navigation.dispatch(NavigationActions.reset({ index: 0, key: null, actions: [NavigationActions.navigate({routeName: 'Main'})]}))
	}
}



const defaultNavOptions = {
	headerStyle: {
		backgroundColor: colors.dark,
	},
	headerTitleStyle: {
		color: 'white',
	},
	headerTintColor: colors.primary,
}



const ModalNavigator = DismissableStackNavigator({
  Login: { 
  	screen: Login,
  	navigationOptions: {
  		title: 'Login',
  		gesturesEnabled: false,
    },
  },
  UnverifiedEmail: {
  	screen: UnverifiedEmail,
  	navigationOptions: {
  		gesturesEnabled: false,
  		header: null,
    },
  },
}, {
  mode: 'modal',
  headerMode: 'none',
})



const MainNavigator = StackNavigator({
  Home: {
    screen: Home
  },
}, {

	cardStyle: {backgroundColor: colors.background},
	navigationOptions: defaultNavOptions
});



const RootNavigator = StackNavigator({
	Init: {
		screen: Init,
		navigationOptions: {
      header: null,
    },
	},
  Main: { 
  	screen: MainNavigator,
  	navigationOptions: ({navigation}) => ({
  		title: 'Conversations',
  		headerBackTitle: null,
    }),
  },
  Modal: { 
  	screen: ModalNavigator,
  },
}, {
  mode: 'modal',
  headerMode: 'none',
  navigationOptions: defaultNavOptions,
  cardStyle: {backgroundColor: colors.background}
});




const navReducer = (state, action) => {
    const newState = RootNavigator.router.getStateForAction(action, state);
    return newState || state;
};
const store = getStore(navReducer);