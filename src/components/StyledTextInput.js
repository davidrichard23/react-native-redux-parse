import React, { Component } from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import colors from '../utils/colors'


export default class StyledTextInput extends Component {

	render() {

		const inlineStyle = {
			height: this.props.height || 40,
			borderRadius: this.props.borderRadius || 0,
			...this.props.styleOveride,
		}

		return (
			<View style={styles.container}>
				<TextInput
					style={[styles.input, inlineStyle]}
					clearButtonMode={'while-editing'} 
					placeholderTextColor='rgba(255,255,255,0.3)' 
					underlineColorAndroid='transparent'
					keyboardAppearance='dark'
					{...this.props} 
				/>
			</View>
		)
	}
}


const styles = StyleSheet.create({
	container: {
		borderWidth: 0,
		alignSelf: 'stretch',
		marginBottom: 1,
	},
	input: {
		color: 'white',
		borderColor: 'black',
		backgroundColor: colors.dark,
		paddingHorizontal: 10,
		fontSize: 16,
	},
})