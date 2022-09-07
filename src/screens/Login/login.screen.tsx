/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
	SafeAreaView,
	StatusBar,
	StyleSheet,
	Text,
	View,
	ImageBackground,
	TextInput,
	TouchableOpacity,
} from 'react-native';
import { RegisterModal } from '../../modals/RegisterModal';
import { loginViewModel } from './login.viewmodel';

export default function Login({ navigation }) {
	const [
		{
			login, 
			setData, 
			isDarkMode, 
			backgroundStyle, 
			image, 
			username, 
			setUsername, 
			password, 
			setPassword, 
			modalVisible,
			setModalVisible,
			setUserBuildings
		}
	] = loginViewModel({navigation});

	return (
		<SafeAreaView style={backgroundStyle}>
			<StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
			<ImageBackground source={image} resizeMode='stretch' style={styles.image}>
				<Text>                                                                                                            </Text>
				<View style={styles.container}>
					<Text style={styles.header}> - Login -</Text>
					<TextInput
						style={styles.textInput} placeholder='Username'
						onChangeText={ (username) => setUsername(username)}
					/>
					<TextInput
						style={styles.textInput} placeholder='Password'
						onChangeText={ (password) => setPassword(password)}
					/>
					<TouchableOpacity
						style={styles.btn}
						onPress={() => {
							login(username, password, setUserBuildings);
						}
						}>
						<Text style={{fontSize: 60, color:'green'}}>Log in</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.btn}
						onPress={() => {
							setModalVisible(true);
						}
						}>
						<Text style={{fontSize: 60, color:'green'}}>Register</Text>
					</TouchableOpacity>
				</View>
			</ImageBackground>
			<View style={styles.centeredView}>
				<RegisterModal modalVisible={modalVisible} setModalVisible={() => setModalVisible(true)} setData={setData}/>
			</View>
		</SafeAreaView>
	);
}
 
const styles = StyleSheet.create({
	image: {
		alignSelf:'center',
		height: 750
	},
	container: {
		flex:1,
		alignItems:'center',
		justifyContent:'center',
		paddingLeft:40,
		paddingRight:40,
		color: 'red'
	},
	header: {
		fontSize:24,
		fontWeight:'bold'
	},
	textInput:{
		alignSelf:'stretch',
		padding:16,
		marginBottom:20,
	},
	btn: {
		alignSelf: 'stretch',
		padding:20,
		alignItems:'center'
	},
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22
	},
});
 