import {App, Query, Destroy, Cloud} from 'parse-lite'
import config from '../../../config'
import { NavigationActions } from 'react-navigation'

const app = new App({
  host: config.host, 
  applicationId: config.appId, 
})


export function addNotification(notification) {

  return function(dispatch, getState) {

    dispatch({type: 'ADD_NOTIFICATION', payload: notification})
  }
}


export function removeNotification() {

  return function(dispatch, getState) {

    dispatch({type: 'REMOVE_NOTIFICATION'})
  }
}