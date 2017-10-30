import React, {Component} from 'react'
import { View, Text, StyleSheet, TouchableOpacity, AppState} from 'react-native'
import { connect } from 'react-redux'
import colors from '../utils/colors.json'
import StyledButton from '../components/StyledButton'
import * as userActions from '../redux/user/userActions'
import { NavigationActions } from 'react-navigation'



@connect((store) => {
  return {
    user: store.user.user,
  }
})
export default class UnverifiedEmail extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	appState: AppState.currentState
	  };
	}

	componentWillMount() {
		// this.props.dispatch(userActions.listenForEmailVerification())
		AppState.addEventListener('change', this._handleAppStateChange);
	}
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
			this.props.dispatch(userActions.checkEmailVerification())
    }
    this.setState({appState: nextAppState})
  };

	componentWillReceiveProps(nextProps) {
		if (!nextProps.user) return

		if (nextProps.user.emailVerified) {
			this.props.navigation.dispatch(NavigationActions.reset({ index: 0, key: null, actions: [NavigationActions.navigate({routeName: 'MainNavigator'})]}))
			AppState.removeEventListener('change', this._handleAppStateChange);
		}
	}


	render() {

		return (
			<View style={styles.container}>
				<Text style={styles.titleText}>Please Verify Your Email</Text>
				<Text style={styles.text}>Check your email for a verification link.</Text>
				<StyledButton onPress={this.resendVerification.bind(this)} text={'Resend Verification'} />
			</View>
		)
	}


	resendVerification() {
		const email = this.props.user.email
		this.props.dispatch(userActions.resendVerification(email))
	}

}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.background,
	},
	titleText: {
		color: colors.primary,
		fontSize: 28,
		textAlign: 'center',
		marginBottom: 15,
	},
	text: {
		color: 'white',
		textAlign: 'center',
		// fontSize: 28,
	},
})