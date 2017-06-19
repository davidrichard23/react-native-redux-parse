import React, {Component} from 'react'
import { View, Text, StyleSheet, TouchableOpacity, AppState} from 'react-native'
import { connect } from 'react-redux'
import colors from '../utils/colors.json'
import { NavigationActions } from 'react-navigation'



@connect((store) => {
  return {
    user: store.user.user,
  }
})
export default class Home extends Component {

	render() {

		return (
			<View style={styles.container}>
				<Text style={styles.titleText}>This is your home screen</Text>
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
})