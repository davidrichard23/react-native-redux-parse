import React, {Component} from 'react'
import { View, Text, StyleSheet } from 'react-native'
import colors from '../utils/colors.json'


export default class FormError extends Component {


	render() {

		const errorText = this.props.text || 'Error'

		return (
			<View style={styles.container}>
				<Text style={styles.errorText}>{errorText}</Text>
			</View>
		)
	}
}



const styles = StyleSheet.create({
	container: {
		// flex: 1,
		justifyContent: 'center',
		backgroundColor: colors.red,
		alignSelf: 'stretch',
		padding: 5,
	},
	errorText: {
		color: 'white',
		textAlign: 'center',
	}
})