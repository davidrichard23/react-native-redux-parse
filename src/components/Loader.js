import React, {Component} from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'


export default class Loader extends Component {


	render() {

		const fullScreen = this.props.fullScreen || false
		const containerStyle = fullScreen ? styles.fullScreen : styles.container

		return (
			<View style={containerStyle}>
				<Text style={styles.loaderText}>Loading...</Text>
			</View>
		)
	}
}


const styles = StyleSheet.create({
	container: {

	},
	fullScreen: {
  	position: 'absolute',
  	top: 0, left: 0, right: 0, bottom: 0,
  	backgroundColor: 'rgba(0,0,0,0.4)',
  	justifyContent: 'center',
  	alignItems: 'center',
  },
	loaderText: {
		color: 'white',
	}
})