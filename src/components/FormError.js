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
		borderWidth: 1,
		borderColor: colors.red,
		alignSelf: 'stretch',
		padding: 5,
		paddingHorizontal: 15,
		marginTop: 10,
		marginBottom: 2,
		borderRadius: 5,
	},
	errorText: {
		color: colors.red,
		textAlign: 'center',
	}
})