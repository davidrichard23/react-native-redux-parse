import React, {Component} from 'react'
import { View, Text, StyleSheet, TouchableOpacity, AppState} from 'react-native'
import { connect } from 'react-redux'
import colors from '../utils/colors.json'
import StyledButton from '../components/StyledButton'
import {resendVerification, checkEmailVerification} from '../actions/user'
import { NavigationActions, StackActions } from 'react-navigation'


class UnverifiedEmail extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	appState: AppState.currentState
	  };
	}

	componentWillMount() {
		// this.props.dispatch(listenForEmailVerification())
		AppState.addEventListener('change', this._handleAppStateChange);
	}
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
			this.props.dispatch(checkEmailVerification())
    }
    this.setState({appState: nextAppState})
  };

	componentWillReceiveProps(nextProps) {
		if (!nextProps.user) return

		if (nextProps.user.emailVerified) {
			this.props.navigation.dispatch(StackActions.reset({ index: 0, key: null, actions: [NavigationActions.navigate({routeName: 'Home'})]}))
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
		this.props.dispatch(resendVerification(email))
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
	},
})


export default connect((store) => {
  return {
    user: store.user.user,
  }
}, null)(UnverifiedEmail)