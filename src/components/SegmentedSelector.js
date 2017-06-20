import React, {Component} from 'react'
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation} from 'react-native'
import colors from '../utils/colors.json'



export default class SegmentedSelector extends Component {

	componentWillUpdate() {
		LayoutAnimation.easeInEaseOut()
	}

	render() {

		const choices = this.props.choices
		const onChange = this.props.onChange
		const selectedIndex = this.props.selectedIndex
		const flexValues = [selectedIndex === 0 ? 0 : 1, 1, selectedIndex === 1 ? 0 : 1]

		return (
			<View style={styles.container}>
				<View style={styles.underlay}>
					<View style={{flex: flexValues[0], backgroundColor: 'transparent', borderRadius: 4}} />
					<View style={{flex: flexValues[1], backgroundColor: colors.darkest, borderRadius: 4}} />
					<View style={{flex: flexValues[2], backgroundColor: 'transparent', borderRadius: 4}} />
				</View>
				{choices.map((item, index) => {
					const color = selectedIndex === index ? colors.primary : 'rgba(255,255,255,0.7)'

					return(
						<View key={item} style={[styles.buttonContainer]}>
							<TouchableOpacity style={styles.button} onPress={() => onChange(index)}>
								<Text style={[styles.text, {color: color}]}>{item}</Text>
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
	underlay: {
		position: 'absolute',
		flexDirection: 'row',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	underlaySelected: {

	},
	button: {
		paddingVertical: 10,
	},
	text: {
		textAlign: 'center',
	},
})