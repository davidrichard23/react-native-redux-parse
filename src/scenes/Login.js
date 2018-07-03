import React, {Component} from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, LayoutAnimation, ScrollView, Keyboard } from 'react-native'
import { connect } from 'react-redux'
import * as userActions from '../redux/user/userActions'
import FormError from '../components/FormError'
import Loader from '../components/Loader'
import { NavigationActions } from 'react-navigation'
import KeyboardSpacer from 'react-native-keyboard-spacer';
import StyledTextInput from '../components/StyledTextInput'
import StyledButton from '../components/StyledButton'
import colors from '../utils/colors.json'
import helpers from '../utils/helpers'
import ImagePicker from 'react-native-image-crop-picker'

const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken,
} = FBSDK;



@connect((store) => {
  return {
    nav: store.nav,
    user: store.user.user,
    fbData: store.user.fbData,
    loading: store.user.loading,
  }
})
export default class Login extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	isSignup: false,
	  	isFacebookLoggedIn: false,
	  	email: {isInvalid: false, value: ''},
			password: {isInvalid: false, value: ''},
			username: {isInvalid: false, value: ''},
			avatar: {isInvalid: false, value: null},
	  };

	  this.submit = this.submit.bind(this)
	  this.toggleSignup = this.toggleSignup.bind(this)
	}

	componentWillMount() {

		if (!this.props.user) return

		// check if user signed up with facebook but never chose a username
		const isNew = !this.props.user.email
		if (isNew) {
			this.setState({isFacebookLoggedIn: true, isSignup: true})
			this.props.dispatch(userActions.fetchFacebookProfileData())
		}
	}

	componentWillUpdate() {
		LayoutAnimation.easeInEaseOut()
	}

	componentWillReceiveProps(newProps) {
		this.checkForFBDataUpdate(newProps)
	}


	checkForFBDataUpdate(newProps) {

		if (!this.props.fbData && newProps.fbData) {
			this.onFBDataReceived(newProps.fbData)
		}
	}


	render() {

		const submitText = !this.state.isSignup ? 'Login' : 'Signup'
		const toggleText = this.state.isSignup ? 'Back To Login' : 'Signup'

		return (
			<View style={{flex: 1}}>
				<ScrollView style={styles.container} contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps='handled'>

					{this.state.isSignup && this.Avatar()}
					{this.Forms()}
					
	        {/*!this.state.isFacebookLoggedIn && 
						<LoginButton
		          readPermissions={["email", "public_profile", "user_birthday", "user_photos"]}
		          onLoginFinished={this.onFBLogin.bind(this)}
		        />
		      */}

					<StyledButton onPress={this.submit.bind(this)} text={submitText} />

		      {!this.state.isFacebookLoggedIn && 
						<TouchableOpacity onPress={this.toggleSignup}>
							<Text style={styles.toggleButton}>{toggleText}</Text>
						</TouchableOpacity>
					}
				</ScrollView>

				<KeyboardSpacer />

			</View>
		)
	}


	Avatar() {

		const avatar = this.state.avatar.value

		return (
			<View style={styles.avatarContainer}>
				<TouchableOpacity style={styles.avatar} onPress={this.openAvatarSelector.bind(this)}>
					<Text style={styles.addAvatarText}>+</Text>
					{avatar && <Image resizeMode='cover' style={styles.avatar} source={{uri: avatar}} />}
				</TouchableOpacity>
				{this.state.avatar.isInvalid && this.state.isSignup && <FormError text='Please choose a profile image' />}
			</View>
		)
	}


	Forms() {

		const email = this.state.email
		const password = this.state.password
		const username = this.state.username

		return (
			<View style={styles.formContainer}>

				{this.state.isSignup &&
					<View style={styles.signupContainer}>
						{email.isInvalid && this.state.isSignup && <FormError text='Please enter a valid email' />}
						<StyledTextInput 
							placeholder='Email'
							value={email.value} 
							autoCapitalize='none'
							autoCorrect={false}
							keyboardType='email-address'
							borderRadius={3}
							marginBottom={0.5}
							onChangeText={this.onChangeText.bind(this, 'email')} 
						/>
					</View>
				}

				{username.isInvalid && this.state.isSignup && <FormError text='Username must be at least 2 characters and can contain leters, numbers, and underscores.' />}
				<StyledTextInput 
					placeholder='Username'
					value={username.value} 
					autoCapitalize='none'
					autoCorrect={false}
					borderRadius={3}
					marginBottom={0.5}
					onChangeText={this.onChangeText.bind(this, 'username')} 
				/>

				{password.isInvalid && this.state.isSignup && <FormError text='Passwords must be at least 8 characters with one capital and one number' />}
				{!this.state.isFacebookLoggedIn && 
					<StyledTextInput 
						placeholder='Password'
						value={password.value}
						autoCapitalize='none'
						secureTextEntry={true}
						autoCorrect={false} 
						borderRadius={3}
						marginBottom={0.5}
						onChangeText={this.onChangeText.bind(this, 'password')} 
					/>
				}
					
			</View>
		)
	}


	onChangeText(key, value) {
		const newObject = {...this.state[key], value: value}
		this.setState({[key]: newObject})
	}


	toggleSignup() {
		this.setState({isSignup: !this.state.isSignup})
	}


	submit() {

		if (this.state.isSignup) 
			this.signup()
		else
			this.login()
	}


	login() {

		const username = this.state.username.value
		const password = this.state.password.value

		this.props.dispatch(userActions.login(username, password))
		.then((user) => {
			if (user) {
				this.props.dispatch(userActions.checkEmailVerification())
				.then((isVerified) => {
					if (isVerified)
						this.goToHome()
					else 
						this.goToUnverifiedEmailScreen()
				})
			}
		}).done()
	}


	onFBLogin(error, result) {
		if (error) {
		  alert("login has error: " + result.error);
		} else if (result.isCancelled) {
		  // alert("login is cancelled.");
		} else {
			this.props.dispatch(userActions.fetchFacebookProfileData())
		  AccessToken.getCurrentAccessToken().then((data) => {
				return this.props.dispatch(userActions.facebookLogin(data))
	    })
	    .then(user => {
	    	const isNew = !user.email === true
	    	if (isNew) {
	    		this.setState({isFacebookLoggedIn: true, isSignup: true})
	    	}
	    })
		}
	}


	onFBDataReceived(fbData) {

		this.fetchFBImageData(fbData.picture.data.url)
		.then((imageData) => {
			this.setState({
				avatar: {...this.state.avatar, value: imageData},
				email: {...this.state.email, value: fbData.email},
			})
		})
	}


	fetchFBImageData(url) {

		return new Promise((resolve, reject) => {
			// const xhr = new XMLHttpRequest()
			const xmlHTTP = new XMLHttpRequest()

			xmlHTTP.open('GET', url, true)
			xmlHTTP.responseType = 'arraybuffer'
			xmlHTTP.onload = function(e) {
			  const arr = new Uint8Array(this.response)
			  const raw = String.fromCharCode.apply(null,arr)
			  const b64 = btoa(raw)
			  const dataURL="data:image/png;base64," + b64
			  resolve(dataURL)
			};
			xmlHTTP.send()
		})
	}


	signup() {

		const data = {
			avatar: this.state.avatar.value,
			email: this.state.email.value.toLowerCase(),
			username: this.state.username.value,
			password: this.state.password.value.toLowerCase(),
		}

		if (!this.validateSignup()) return 

		if (!this.state.isFacebookLoggedIn) {
			this.props.dispatch(userActions.signup(data))
			.then(() => {
				this.createProfile(data)
			})
		}
		else {
			this.createProfile(data)
		}
	}


	createProfile(data) {

		this.props.dispatch(userActions.createProfile(data))
		.then(() => {
			this.goToUnverifiedEmailScreen()
		}).done()
	}



	validateSignup() {

		let isValid = true

		const email = this.state.email.value
		const password = this.state.password.value
		const username = this.state.username.value
		const avatar = this.state.avatar.value

		if (!helpers.validateEmail(email)) {
			isValid = false
			this.setIsInvalidField('email', true)
		}
		else this.setIsInvalidField('email', false)

		if (!this.state.isFacebookLoggedIn) {
			if (!helpers.validatePassword(password)) {
				isValid = false
				this.setIsInvalidField('password', true)
			}
			else this.setIsInvalidField('password', false)
		}

		const illegalUsernameChars = /\W/ // allow letters, numbers, and underscores
		if (username.length < 2 || illegalUsernameChars.test(username)) {
			isValid = false
			this.setIsInvalidField('username', true)
		}
		else this.setIsInvalidField('username', false)

		if (avatar === null) {
			isValid = false
			this.setIsInvalidField('avatar', true)
		}
		else this.setIsInvalidField('avatar', false)

		return isValid
	}


	setIsInvalidField(key, isInvalid) {
		const newObject = {...this.state[key], isInvalid: isInvalid}
		this.setState({[key]: newObject})
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


	openAvatarSelector() {

		ImagePicker.openPicker({
		  width: 600,
		  height: 600,
		  cropping: true,
		  cropperCircleOverlay: true,
		  includeBase64: true,
		  mediaType: 'photo',
		  compressImageQuality: 0.9,
		})
		.then(image => {
		  const data = 'data:image/jpg;base64,' + image.data
		  return this.setState({avatar: {...this.state.avatar, value: data}})
		})
		.catch(error => {
			console.log('Error: ' + error)
		}).done()
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
  },
  avatarContainer: {
		alignItems: 'center',
  },
  avatar: {
		width: 100,
		height: 100,
		backgroundColor: 'rgba(255,255,255,0.05)',
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
  	marginBottom: 20,
  },
  signupContainer: {
  	alignSelf: 'stretch',
  },
  toggleButton: {
  	color: colors.primary,
  	fontSize: 18,
  },
})
