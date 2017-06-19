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
    sessionToken: store.user.sessionToken
  }
})
class Init extends Component {

	componentWillMount() {
		this.getSessionToken()
	}

	render() {

		return <Loader fullScreen={true} />
	}

	getSessionToken() {

		this.props.dispatch(userActions.getCurrentUser())
		.then(() => {
			this.chooseInitialRoute()
		}).done()
	}


	chooseInitialRoute() {

		let actions = []
		if (!this.props.sessionToken) 
			actions.push(NavigationActions.navigate({ routeName: 'Login'}))
		else {
			if (!this.props.user.emailVerified) 
				actions = [NavigationActions.navigate({ routeName: 'UnverifiedEmail'})]
			else {
				actions = [NavigationActions.navigate({ routeName: 'Main'})]
			}
		} 

		this.props.navigation.dispatch(NavigationActions.reset({
		  index: 0,
		  key: null,
		  actions: actions,
		}))
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



const DismissableLoginNavigator = DismissableStackNavigator({
  Login: { 
  	screen: Login,
  	navigationOptions: {
  		title: 'Login',
  		gesturesEnabled: false,
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
  Login: {
  	screen: DismissableLoginNavigator,
  	navigationOptions: {
  		title: 'Login',
  		gesturesEnabled: false,
  		header: null,
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
  navigationOptions: defaultNavOptions,
  cardStyle: {backgroundColor: colors.background}
});




const navReducer = (state, action) => {
    const newState = RootNavigator.router.getStateForAction(action, state);
    return newState || state;
};

const store = getStore(navReducer);