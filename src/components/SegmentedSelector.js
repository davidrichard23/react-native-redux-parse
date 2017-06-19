import React, {Component} from 'react'
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import colors from '../utils/colors.json'



export default class SegmentedSelector extends Component {

	render() {

		const choices = this.props.choices
		const onChange = this.props.onChange
		const selectedIndex = this.props.selectedIndex

		return (
			<View style={styles.container}>
				{choices.map((item, index) => {
					const bgColor = selectedIndex === index ? colors.primary : 'transparent'
					const inlineStyle = {backgroundColor: bgColor}

					return(
						<View key={item} style={[styles.buttonContainer, inlineStyle]}>
							<TouchableOpacity style={styles.button} onPress={() => onChange(index)}>
								<Text style={styles.text}>{item}</Text>
							</TouchableOpacity>
						</View>
					)
				})}
			</View>
		)
	}
}


const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignSelf: 'stretch',
		// justifyContent: 'space-around',
		backgroundColor: 'rgba(0,0,0,0.2)',
		borderRadius: 4,
	},
	buttonContainer: {
		flex: 1,
		borderRadius: 4,
	},
	button: {
		// flex: 1,
		paddingVertical: 10,
	},
	text: {
		color: 'white',
		textAlign: 'center',
	},
})