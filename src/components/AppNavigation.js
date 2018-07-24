import React, { Component } from 'react'
import { createStackNavigator } from 'react-navigation';
import DismissableStackNavigator from '../components/DismissableStackNavigator'
import colors from '../utils/colors.json'

import Init from './Init'
import Home from '../screens/Home'
import Login from '../screens/LoginContainer'
import UnverifiedEmail from '../screens/UnverifiedEmail'


export default AppNavigation = props => {
  return <RootNavigator />
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

const RootNavigator = createStackNavigator({
	Init: {
		screen: Init,
		navigationOptions: {
      header: null,
    },
	},
  Home: {
    screen: Home
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
