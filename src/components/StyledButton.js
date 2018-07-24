import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import colors from '../utils/colors.json'


export default class StyledButton extends Component {

	render() {

		return (
			<View style={styles.container}>
				<TouchableOpacity style={styles.button} onPress={this.props.onPress}>
					<Text style={styles.text}>{this.props.text}</Text>
				</TouchableOpacity>
			</View>
		)
	}
}


const styles = StyleSheet.create({
	container: {
		// flex: 1,
	},
	button: {
  	backgroundColor: colors.primary,
  	marginTop: 20,
  	borderRadius: 5,
  	paddingHorizontal: 30,
  	paddingVertical: 10,
  },
  text: {
  	color: 'white',
  	fontSize: 18,
  	textAlign: 'center',
  },
})