import React, { Component } from 'react'
import { View, AppRegistry, StatusBar, UIManager, Platform, AsyncStorage} from 'react-native'
import { Provider } from 'react-redux'
import store from './src/utils/store'
import AppNavigation from './src/components/AppNavigation'
import config from './src/utils/config'
import Parse from 'parse/react-native'
import Notifications from './src/components/Notifications'


export default class App extends Component {

  componentWillMount() {
    // need to use the official parse sdk for liveQuery
    Parse.initialize(config.appId)
    Parse.serverURL = config.host
    Parse.setAsyncStorage(AsyncStorage)

    // disable this if you are experiencing weird animation glitches on Android
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true)
    }
  }
  

  render() {

    return (
      <Provider store={store}>
        <View style={{flex: 1}}>
          <StatusBar translucent={true} barStyle="light-content" animated={true}/>
          <AppNavigation />
          <Notifications />
        </View>
      </Provider>
    )
  }
}


AppRegistry.registerComponent('ReactNativeReduxParse', () => App);