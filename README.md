I created this template app to help expedite the proccess of creating a user account based React Native app using Redux and [Parse Server](https://github.com/parse-community/parse-server) for the backend.

By using this along with Parse Server, you can have a fully functional app and backend with login functionality and email verification in less than a 30 mins of setup.

It primarily uses [Parse-Lite](https://github.com/andrewimm/parse-lite) but also needs the official [Parse JS SDK](https://github.com/parse-community/Parse-SDK-JS) for certain things like Live Query and File uploads

It also uses [React Navigation](https://github.com/react-community/react-navigation)

## Getting Started

To get started, all you need to do is clone this repo, run `npm install`, and update ``config.json`` with your Parse Server host and App ID

## Facebook Login

To use Facebook login, you'll need to follow the install instructions [here](https://github.com/facebook/react-native-fbsdk) (start at step #3)

Otherwise just remove the FBLoginButton in src/scenes/Login.js

## Issues

In React Native 0.43 ``react-native/Libraries/react-native/react-native.js`` was renamed to ``react-native/Libraries/react-native/react-native-implementation.js``. The Parse JS SDK references the old file so it'll throw an unknown module error. 

It seems like the latest Parse SDK(1.10.0) tried to fix this with a try statement but I still receive the error. The fix for now is to open ``node_modules/parse/lib/react-native/StorageController.react-native.js`` and change these lines:

```javascript
let AsyncStorage;
try {
  //for React Native 0.43+
  AsyncStorage = require('react-native/Libraries/react-native/react-native-implementation').AsyncStorage;
} catch (error) {
  AsyncStorage = require('react-native/Libraries/react-native/react-native.js').AsyncStorage;
}
```

to this:

```javascript
let AsyncStorage = require('react-native/Libraries/react-native/react-native-implementation').AsyncStorage;
```