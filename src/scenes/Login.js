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
import Picker from 'react-native-picker'

const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken,
} = FBSDK;



let datePickerData = [
	['January','February','March','April','May','June','July','August','September','October','November','December'],
	[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
	[]
]
for (let i = 0; i<60; i++) {
	datePickerData[2].push(2017-i)
}





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
	  	isPickerOpen: false,
	  	isPickingDOB: false,
	  	isFacebookLoggedIn: false,
	  	email: {isInvalid: false, value: ''},
			password: {isInvalid: false, value: ''},
			username: {isInvalid: false, value: ''},
			avatar: {isInvalid: false, value: null},
			firstName: {isInvalid: false, value: ''},
			gender: {isInvalid: false, value: 'Male'},
			dob: {isInvalid: false, value: ['January', 1, 2017]},
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
					
	        {!this.state.isFacebookLoggedIn && 
						<LoginButton
		          readPermissions={["email", "public_profile", "user_birthday", "user_photos"]}
		          onLoginFinished={this.onFBLogin.bind(this)}
		        />
		      }

					<StyledButton onPress={this.submit.bind(this)} text={submitText} />

		      {!this.state.isFacebookLoggedIn && 
						<TouchableOpacity onPress={this.toggleSignup}>
							<Text style={styles.toggleButton}>{toggleText}</Text>
						</TouchableOpacity>
					}


				</ScrollView>

				{this.Pickers()}

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
		const firstName = this.state.firstName
		const birthday = this.state.birthday
		const gender = this.state.gender

		return (
			<View style={styles.formContainer}>

				{this.state.isSignup &&
					<View style={styles.signupContainer}>
						{firstName.isInvalid && this.state.isSignup && <FormError text='Please enter a valid first name' />}
						<StyledTextInput 
							placeholder='First Name'
							value={firstName.value} 
							autoCorrect={false}
							borderRadius={3}
							marginBottom={0.5}
							onChangeText={this.onChangeText.bind(this, 'firstName')} 
							onFocus={() => {
								this.setState({isPickerOpen: false})
								this.genderPicker.hide()
								this.dobPicker.hide()
							}}
						/>
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
							onFocus={() => {
								this.setState({isPickerOpen: false})
								this.genderPicker.hide()
								this.dobPicker.hide()
							}}
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
					onFocus={() => {
						this.setState({isPickerOpen: false})
						this.genderPicker.hide()
						this.dobPicker.hide()
					}}
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
						onFocus={() => {
							this.setState({isPickerOpen: false})
							this.genderPicker.hide()
							this.dobPicker.hide()
						}}
					/>
				}

				{this.state.isSignup && 
					<View>
						<TouchableOpacity 
							onPress={() => this.handlePickerAction(this.genderPicker, this.dobPicker)}
							style={styles.pickerSelector}>
							<Text style={styles.pickerDescriptorText}>{`Gender  `}</Text>
							<Text style={styles.pickerSelectorText}>{!this.state.gender.value ? 'Gender' : this.state.gender.value}</Text>
						</TouchableOpacity>
						<TouchableOpacity 
							onPress={() => this.handlePickerAction(this.dobPicker, this.genderPicker)}
							style={styles.pickerSelector}>
							<Text style={styles.pickerDescriptorText}>{`DOB  `}</Text>
							<Text style={styles.pickerSelectorText}>{`${this.state.dob.value[0]} ${this.state.dob.value[1]}, ${this.state.dob.value[2]}`}</Text>
						</TouchableOpacity>
					</View>
				}	
					
			</View>
		)
	}


	Pickers() {

		return (
			<View>
				{this.state.isPickerOpen && <View style={{height: 240}} />}
				<Picker
					style={{
						height: 300
					}}
					ref={genderPicker => this.genderPicker = genderPicker}
					style={styles.picker}
					showDuration={300}
					pickerData={['Male','Female']}
					selectedValue={this.state.gender.value}
					onPickerDone={(selectedValue) => {
						this.setState({
							gender: {...this.state.gender, value: selectedValue},
							isPickerOpen: false,
						}
					)}}
					pickerCancelBtnText=''
				/>
				<Picker
					style={{
						height: 300
					}}
					ref={dobPicker => this.dobPicker = dobPicker}
					style={styles.picker}
					showDuration={300}
					pickerData={datePickerData}
					selectedValue={this.state.dob.value}
					onPickerDone={(selectedValue) => {
						this.setState({
							dob: {...this.state.dob, value: selectedValue},
							isPickerOpen: false,
						}
					)}}
					pickerCancelBtnText=''
				/>
			</View>
		)
	}


	handlePickerAction(primaryPicker, secondaryPicker) {

		if (primaryPicker.isPickerShow()) {
			this.setState({isPickerOpen: false})
			primaryPicker.hide()
		}
		else {
			if (secondaryPicker.isPickerShow()) {
				secondaryPicker.hide()
				this.setState({isPickerOpen: false})
				setTimeout(() => {
					this.setState({isPickerOpen: true})
					primaryPicker.show()
				}, 350)
				return
			}
			this.setState({isPickerOpen: true})
			primaryPicker.show()
			Keyboard.dismiss()
		}
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

		const gender = fbData.gender === 'male' ? 'Male' : 'Female'
		let dob = fbData.birthday.split('/')
		dob[0] = datePickerData[0][Number(dob[0]) - 1]

		this.fetchFBImageData(fbData.picture.data.url)
		.then((imageData) => {
			this.setState({
				avatar: {...this.state.avatar, value: imageData},
				firstName: {...this.state.firstName, value: fbData.first_name},
				email: {...this.state.email, value: fbData.email},
				gender: {...this.state.gender, value: gender},
				dob: {...this.state.dob, value: dob},
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

		const dobArray = this.state.dob.value
		const dob = new Date(dobArray.join('-'))
		const gender = this.state.gender.value === 'Male' ? 'MALE' : 'FEMALE'

		const data = {
			avatar: this.state.avatar.value,
			email: this.state.email.value.toLowerCase(),
			username: this.state.username.value,
			password: this.state.password.value.toLowerCase(),
			firstName: this.state.firstName.value,
			gender: gender,
			dob: dob,
		}

		console.log(data)

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
		const firstName = this.state.firstName.value
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

		if (firstName.length < 2) {
			isValid = false
			this.setIsInvalidField('firstName', true)
		}
		else this.setIsInvalidField('firstName', false)

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
  pickerSelector: {
  	backgroundColor: colors.dark,
  	padding: 10,
  	// justifyContent: 'flex',
  	marginBottom: 0.5,
  	flexDirection: 'row',
  },
  pickerDescriptorText: {
  	color: colors.primaryLight,
  },
  pickerSelectorText: {
  	color: 'white',
  },
})
