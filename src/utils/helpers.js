
import * as userActions from '../redux/user/userActions'
import config from '../../config'


export default helpers = {

  createPointer(id, className) {
    return {className: className, objectId: id, __type: 'Pointer'}
  },

  validateEmail(email) {

    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(email);
  },

  validatePassword(password) {

    if ( password.length < 8 || password.search(/[a-zA-Z]+/) == -1 || password.search(/[0-9]+/) == -1 ) return false;
    
    let hasUpper = false
    let hasLower = false
    let hasNumber = false
    let character=''

    for (var i=0; i < password.length; i++){
      character = password.charAt(i);
      if (!isNaN(character * 1)) hasNumber = true;
      else {
          if (character == character.toUpperCase()) hasUpper = true;
          if (character == character.toLowerCase()) hasLower = true;
      }
    }
    if ( hasUpper && hasLower ) return true;
    else return false;
  },


  handleParseError(error, dispatch) {

    console.log(error)

    if (error.response || error.code) {
      const code = error.response ? error.response.code : error.code

      switch (code) {
        case 101: 
          alert('Invalid Username or Password')
          break
        case 200: 
          alert('Username is required')
          break
        case 201: 
          alert('Password is required')
          break
        case 202: 
          alert('An account already exists for this email.')
          break
        case 205: 
          alert('You must verify your email before you can login again.')
          break
        case 209: // invalid session
          alert('Your session has timed out, please sign in')
          dispatch(userActions.logout())
          break
        default: 
          if (config.verboseErrors) {
            alert('Error: ' + JSON.stringify(error))
          }
          else
            alert('Something went wrong, please try again')
      }
    }
    else {
      if (config.verboseErrors)
        alert('Error: ' + JSON.stringify(error))
      else
        alert('Something went wrong, please try again')
    }
  },
}