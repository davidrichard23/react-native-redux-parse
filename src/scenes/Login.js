import React, {Component} from 'react'
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation } from 'react-native'
import { connect } from 'react-redux'
import * as userActions from '../redux/user/userActions'
import * as loginUIActions from '../redux/loginUI/loginUIActions'
import FormError from '../components/FormError'
import Loader from '../components/Loader'
import { NavigationActions } from 'react-navigation'
import KeyboardSpacer from 'react-native-keyboard-spacer';
import StyledTextInput from '../components/StyledTextInput'
import StyledButton from '../components/StyledButton'
import colors from '../utils/colors.json'


@connect((store) => {
  return {
    nav: store.nav,
    isSignup: store.loginUI.isSignup,
    isProvider: store.loginUI.isProvider,
    user: store.loginUI.user,
    loading: store.user.loading,
  }
})
export default class Login extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {};

	  this.submit = this.submit.bind(this)
	  this.toggleSignup = this.toggleSignup.bind(this)
	}

	componentWillUpdate() {
		LayoutAnimation.easeInEaseOut()
	}


	render() {

		const submitText = !this.props.isSignup ? 'Login' : 'Signup'
		const toggleText = this.props.isSignup ? 'Login' : 'Signup'
		const segmentChoices = ['Non-Provider', 'Provider']
		const selectedSegment = this.props.isProvider ? 1 : 0

		return (
			<View style={styles.container}>

				{this.Forms()}
				
				<StyledButton onPress={this.submit.bind(this)} text={submitText} />

				<TouchableOpacity onPress={this.toggleSignup}>
					<Text style={styles.toggleButton}>{toggleText}</Text>
				</TouchableOpacity>

				<KeyboardSpacer/>
			</View>
		)
	}


	Forms() {

		const user = this.props.user
		const email = user.email
		const password = user.password
		const username = user.username

		return (
			<View style={styles.formContainer}>

				{this.props.isSignup &&
					<View style={styles.signupContainer}>
						{email.isInvalid && <FormError text='Please enter a valid email' />}
						<StyledTextInput 
							placeholder='Email'
							value={email.value} 
							autoCapitalize='none'
							autoCorrect={false}
							keyboardType='email-address'
							borderRadius={3}
							onChangeText={this.onChangeText.bind(this, 'email')} 
						/>
					</View>
				}

				{username.isInvalid && <FormError text='Username must be at least 2 characters and can contain leters, numbers, and underscores.' />}
				<StyledTextInput 
					placeholder='Username'
					value={username.value} 
					autoCapitalize='none'
					autoCorrect={false}
					borderRadius={3}
					onChangeText={this.onChangeText.bind(this, 'username')} 
				/>

				{password.isInvalid && <FormError text='Passwords must be at least 8 characters with one capital and one number' />}
				<StyledTextInput 
					placeholder='Password'
					value={password.value}
					autoCapitalize='none'
					secureTextEntry={true}
					autoCorrect={false} 
					borderRadius={3}
					onChangeText={this.onChangeText.bind(this, 'password')} 
				/>

			</View>
		)
	}


	onChangeText(key, value) {
		this.props.dispatch(loginUIActions.setInfo(key, value))
	}


	toggleSignup() {
		this.props.dispatch(loginUIActions.setIsSignup(!this.props.isSignup))
	}

	onChangeUserType(index) {
		const isProvider = index === 0 ? false : true
		this.props.dispatch(loginUIActions.setIsProvider(isProvider))
	}


	submit() {

		if (this.props.isSignup) 
			this.signup()
		else
			this.login()
	}


	login() {

		const username = this.props.user.username.value
		const password = this.props.user.password.value

		this.props.dispatch(userActions.login(username, password))
		.then((user) => {
			if (user)
				this.goToHome()
		}).done()
	}


	signup() {

		const user = this.props.user

		this.props.dispatch(loginUIActions.validateSignup(user))
		.then((isInvalid) => {
			if (!isInvalid) {
				this.props.dispatch(userActions.signup(user))
				.then((auth) => {
					if (auth){
						this.goToUnverifiedEmailScreen()
					}
				}).done()
			}
		}).done()
	}


	goToUnverifiedEmailScreen() {

		this.props.navigation.dispatch({
		  type: NavigationActions.NAVIGATE,
		  routeName: 'UnverifiedEmail',
		})
	}

	
	goToHome() {
		this.props.navigation.dispatch(NavigationActions.reset({index: 0, key: null, actions: [NavigationActions.navigate({ routeName: 'Main'})]}))
	}

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  formContainer: {
  	alignSelf: 'stretch',
  	marginTop: 10,
  },
  signupContainer: {
  	alignSelf: 'stretch',
  },
  toggleButton: {
  	color: colors.primary,
  	marginTop: 40,
  	fontSize: 18,
  	textDecorationLine: 'underline',
  },
})