I created this template to help expedite the proccess of creating a user account based React Native app using Redux and [Parse Server](https://github.com/parse-community/parse-server) for the backend. It's based off the [Create React Native App](https://github.com/react-community/create-react-native-app)

It primarily uses [Parse-Lite](https://github.com/andrewimm/parse-lite) but also needs the official [Parse JS SDK](https://github.com/parse-community/Parse-SDK-JS) for certain things like Live Query and File uploads

It also uses [React Navigation](https://github.com/react-community/react-navigation)

## Getting Started

To get started, all you need to do is clone this repo, run npm install, and update ``config.json`` with your Parse Server host and App ID

## Issues

In React Native 0.43 ``react-native/Libraries/react-native/react-native.js`` was renamed to ``react-native/Libraries/react-native/react-native-implementation.js``. The Parse JS SDK references the old file so it'll throw an unknown module error. 

What you need to is change the import line in ``node_modules/parse/lib/react-native/StorageController.react-native.js`` to ``import { AsyncStorage } from 'react-native/Libraries/react-native/react-native-implementation.js'`` until the Parse JS SDK is updated.