import React, {Component} from 'react'
import { View, Text, StyleSheet} from 'react-native'
import { connect } from 'react-redux'
import colors from '../utils/colors.json'

export default class Home extends Component {

	render() {

		return (
			<View style={styles.container}>
				<Text style={styles.titleText}>This is your home screen</Text>
				<Text style={styles.text}>{`Start building your app by opening: 
					
src/screens/Home.js`}</Text>
			</View>
		)
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
	},
	titleText: {
		color: colors.primary,
		fontSize: 28,
		textAlign: 'center',
		marginBottom: 15,
	},
	text: {
		color: 'white',
		fontSize: 16,
		textAlign: 'center',
	},
})