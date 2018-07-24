# A React Native app template using Parse Server for the backend. 

Enables you to have a React Native app with these capabilities up and running in minutes:

- User account/profile creation
- User login
- Email verification
- Navigation
- In-app Notifications

## Major Dependencies

- [Parse-Lite](https://github.com/andrewimm/parse-lite) for most tasks 
- [Official Parse JS SDK](https://github.com/parse-community/Parse-SDK-JS) for certain things like Live Query and File uploads
- [React Navigation](https://github.com/react-community/react-navigation)
- [Redux](https://github.com/reduxjs/redux)

## Getting Started

1. Set up a [Parse Server](https://github.com/parse-community/parse-server) 
2. Clone this repo
3. Run `npm install`
4. Update `src/utils/config.json` with your Parse Server host and App ID
5. Run `react-native run-ios` or `react-native run-android`

## Working with the template

#### Navigation 

To add new screens: 

1. Create a new file in `src/screens`
2. Open `src/components/AppNavigation.js`
3. Import your new screen
4. Add your new screen to either the `RootNavigator` or the `ModalNavigator`

#### Extra Profile Data

The only data saved to a user's profile object is their username and avatar image. 
To add more data to a user's profile (e.g. Full Name, DOB, Bio, etc), follow these steps:

1. Open `src/reducers/loginUI.js`
2. Add your new data fields to the initial state
3. Open `src/screens/Login.js`
4. Add whatever user input markup you need to the `Forms()` function or elsewhere
5. Scroll down to the `signup()` function
6. Add your new data to the `signupData` object

#### Email Verification

1. Setup your parse server for [email verification](https://github.com/parse-community/parse-server#email-verification-and-password-reset)
2. Open `src/actions/user.js`
3. Scroll down to `resendVerification()`
4. Copy the commented function into your Parse Server Cloud Code file (the default is `cloud/main.js`)
5. Remove comments and `alert` from `src/actions/user.js`

#### Redux Reducers

When adding new reducers, be sure to import and add it to the `combineReducers` function in `src/reducers/index.js`