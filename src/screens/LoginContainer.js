import { connect } from 'react-redux'
import { NavigationActions, StackActions } from 'react-navigation';
import ImagePicker from 'react-native-image-crop-picker'
import Login from './Login'
import {login, signup, createProfile} from '../actions/user'
import {onChangeField, setIsSignup, setValidationErrors} from '../actions/loginUI'

const mapStateToProps = state => {
  return {
    ...state.loginUI,
    user: state.user.user,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChangeText: (key, value) => {
      dispatch(onChangeField(key, value))
    },
    setIsSignup: (isSignup) => {
      dispatch(setIsSignup(isSignup))
    },
    login: (username, password) => {
      dispatch(login(username, password))
    },
    goToHomeScreen: () => {
      ownProps.navigation.dispatch(StackActions.reset({index: 0, key: null, actions: [NavigationActions.navigate({ routeName: 'Home'})]}))
    },
    goToUnverifiedEmailScreen: () => {
      ownProps.navigation.dispatch(NavigationActions.navigate({ routeName: 'UnverifiedEmail'}))
    },
    signup: (signupData) => {
      dispatch(signup(signupData))
      .then(() => dispatch(createProfile(signupData)))
    },
    validateSignupData: ({email, password, username, avatarData}) => dispatch((_, getState) => {

      const isEmailValid = helpers.validateEmail(email)
      const isUsernameValid = helpers.validateUsername(username)
      const isPasswordValid = helpers.validatePassword(password)
      const isAvatarValid = avatarData !== null

      dispatch(setValidationErrors('email', !isEmailValid))
      dispatch(setValidationErrors('username', !isUsernameValid))
      dispatch(setValidationErrors('password', !isPasswordValid))
      dispatch(setValidationErrors('avatar', !isAvatarValid))

      return isEmailValid && isUsernameValid && isPasswordValid && isAvatarValid
    }),
    openAvatarPicker: () => {
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
        dispatch(onChangeField('avatarData', data))
      })
      .catch(error => {
        console.log('Error: ' + error)
      }).done()
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)