import React, {Component} from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, LayoutAnimation, ScrollView } from 'react-native'
import Loader from '../components/Loader'
import FormError from '../components/FormError'
import KeyboardSpacer from 'react-native-keyboard-spacer';
import StyledTextInput from '../components/StyledTextInput'
import StyledButton from '../components/StyledButton'
import colors from '../utils/colors.json'


export default class Login extends Component {

	componentWillUpdate() {
		LayoutAnimation.easeInEaseOut()
	}
	componentWillReceiveProps(newProps) {
		this.checkOnLogin(newProps)
	}

	checkOnLogin(newProps) {
		if (!this.props.user && newProps.user) {
			if (newProps.user.emailVerified) this.props.goToHomeScreen()
			else this.props.goToUnverifiedEmailScreen()
		}
	}


	render() {

		const {isSignup} = this.props

		return (
			<View style={{flex: 1}}>
				<ScrollView style={styles.container} contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps='handled'>
					<Text style={styles.titleText}>Login Screen</Text>
					{isSignup && this.Avatar()}
					{this.Forms()}
					{this.Buttons()}
				</ScrollView>

				<KeyboardSpacer />
			</View>
		)
	}


	Avatar() {

		const {avatarData, avatarError, isSignup} = this.props

		return (
			<View style={styles.avatarContainer}>
				{avatarError && isSignup && <FormError text='Please choose a profile image' />}
				<TouchableOpacity style={styles.avatar} onPress={this.props.openAvatarPicker}>
					<Text style={styles.addAvatarText}>+</Text>
					{avatarData && <Image resizeMode='cover' style={styles.avatar} source={{uri: avatarData}} />}
				</TouchableOpacity>
			</View>
		)
	}


	Forms() {

		const {isSignup, email, password, username, emailError, passwordError, usernameError} = this.props

		return (
			<View style={styles.formContainer}>

				{isSignup &&
					<View style={styles.signupContainer}>
						{emailError === true && isSignup === true && <FormError text='Please enter a valid email' />}
						<StyledTextInput 
							placeholder='Email'
							value={email} 
							autoCapitalize='none'
							autoCorrect={false}
							keyboardType='email-address'
							borderRadius={3}
							marginBottom={0.5}
							onChangeText={(value) => this.props.onChangeText('email', value)} 
						/>
					</View>
				}

				{usernameError === true && isSignup === true && <FormError text='Username must be at least 2 characters and can contain leters, numbers, and underscores.' />}
				<StyledTextInput 
					placeholder='Username'
					value={username} 
					autoCapitalize='none'
					autoCorrect={false}
					borderRadius={3}
					marginBottom={0.5}
					onChangeText={(value) => this.props.onChangeText('username', value)} 
				/>

				{passwordError === true && isSignup === true && <FormError text='Passwords must be at least 8 characters with one capital and one number' />}
				<StyledTextInput 
					placeholder='Password'
					value={password}
					autoCapitalize='none'
					secureTextEntry={true}
					autoCorrect={false} 
					borderRadius={3}
					marginBottom={0.5}
					onChangeText={(value) => this.props.onChangeText('password', value)} 
				/>
			</View>
		)
	}


	Buttons() {
		const {isSignup} = this.props
		const submitText = !isSignup ? 'Login' : 'Signup'
		const toggleText = isSignup ? 'Back To Login' : 'Signup'

		return (
			<View style={styles.buttonsContainer}>
				<StyledButton onPress={this.submit.bind(this)} text={submitText} />
				<TouchableOpacity style={{marginTop: 20}} onPress={() => this.props.setIsSignup(!isSignup)}>
					<Text style={styles.toggleButton}>{toggleText}</Text>
				</TouchableOpacity>
			</View>
		)
	}


	submit() {
		if (this.props.isSignup) 
			this.signup()
		else
			this.props.login(this.props.username, this.props.password)
	}


	signup() {

		const {email, username, password, avatarData} = this.props

		// Add any data you'd like to store in the user's profile here (e.g. Real name, DOB, Bio, etc)
		// Email and password will never be saved in the profile object

		const signupData = {
      avatarData,
      password,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
    }

    // Add additional validation code to the validateSignupData function in the "src/screens/LoginContainer.js" file
		if (!this.props.validateSignupData(signupData)) return 
		this.props.signup(signupData)
	}
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  scrollView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 25,
    paddingHorizontal: 15,
  },
	titleText: {
		color: colors.primary,
		fontSize: 28,
		textAlign: 'center',
		marginVertical: 15,
	},
  avatarContainer: {
		alignItems: 'center',
  },
  avatar: {
		width: 100,
		height: 100,
		backgroundColor: colors.dark,
		borderRadius: 50,
	},
	addAvatarText: {
		position: 'absolute',
		paddingVertical: 18,
		paddingHorizontal: 35,
		fontSize: 48,
		color: 'white',
	},
  formContainer: {
  	alignSelf: 'stretch',
  	marginTop: 10,
  },
  signupContainer: {
  	alignSelf: 'stretch',
  },
  buttonsContainer: {
  	alignSelf: 'stretch',
  },
  toggleButton: {
  	color: colors.primary,
  	fontSize: 18,
  	textAlign: 'center',
  },
})
