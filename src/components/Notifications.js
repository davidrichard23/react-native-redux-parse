import React, {Component} from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar} from 'react-native'
import { connect } from 'react-redux'
import * as appActions from '../redux/app/appActions'
import { NavigationActions } from 'react-navigation'
import colors from '../utils/colors.json'
import * as Animatable from 'react-native-animatable';

const DISPLAY_TIME = 5000

@connect((store) => {
  return {
    user: store.user.user,
    notifications: store.app.notifications,
    nav: store.nav,
  }
})
export default class Notifications extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	activeNotification: null,
	  	isStatusbarHidden: true,
	  };
	}

	componentDidMount() {
		// this.props.dispatch(appActions.addNotification({title: 'New message from David Richard', body: 'This is the message from david talking about the progress on my injury.'}))
	}


	componentWillReceiveProps(nextProps) {
		if (this.props.notifications.length < nextProps.notifications.length) {
			this.showNotification(nextProps.notifications[0])
		}
	}


	render() {

		const notification = this.state.activeNotification
		if (notification === null) return null

		const title = notification.title
		const body = notification.body

		return (
			<Animatable.View ref='view' animation="slideInDown" duration={700} easing='ease-out-quint' style={styles.container}>
				<StatusBar hidden={this.state.isStatusbarHidden} animated />
				<View style={styles.textContainer}>
					<Text numberOfLines={1} style={styles.title}>{title}</Text>
					<Text numberOfLines={2} style={styles.body}>{body}</Text>
				</View>
			</Animatable.View>
		)
	}

	showNotification(notification) {

		if (this.state.activeNotification === null) this.startCountdown()

		this.setState({
			activeNotification: notification,
			isStatusbarHidden: true,
		})
	}

	startCountdown() {
		setTimeout(() => {
			this.setState({isStatusbarHidden: false})
			this.refs.view.slideOutUp(700)
			.then(() => {
				this.props.dispatch(appActions.removeNotification())
				this.setState({activeNotification: null}, () => {
					if (this.props.notifications.length > 0)
						this.showNotification(this.props.notifications[0])
				})
			})
		}, DISPLAY_TIME)
	}
}


const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		// height: Platform.OS !== 'ios' ? 54 : 64,
		left: 0, right: 0,
		backgroundColor: colors.primary,
	},
	textContainer: {
		paddingVertical: 10,
		paddingHorizontal: 15,
	},
	title: {
		color: 'rgba(255,255,255,0.9)',
		fontSize: 16,
		fontWeight: '500',
	},
	body: {
		color: 'rgba(255,255,255, 0.8)',
		fontSize: 14,
	},
})