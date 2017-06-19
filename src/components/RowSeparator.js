import React, { Component } from 'react'
import { View, TextInput, StyleSheet } from 'react-native'


export default class RowSeparator extends Component {

	render() {

		return (
			<View style={styles.container}>

			</View>
		)
	}
}


const styles = StyleSheet.create({
	container: {
		height: 0.5,
		backgroundColor: 'rgba(255,255,255,0.1)',
		marginLeft: 15,
	},
})