import React, { FunctionComponent, useState } from 'react';
import {
	StyleSheet, Modal, View, Text, TextInput, TouchableOpacity,
} from 'react-native';

interface IRegisterModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  setData: (username, password, confirmPassword) => void;
}

export const RegisterModal: FunctionComponent<IRegisterModalProps> = ({
	modalVisible,
	setModalVisible,
	setData
}) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	return (
		<Modal
			animationType="slide"
			transparent
			visible={modalVisible}
			onRequestClose={() => {
				setModalVisible(false);
			}}
		>
			<View style={styles.background}>
				<Text style={styles.header}> - Register -</Text>
				<TextInput
					style={styles.textInput} placeholder='Username'
					onChangeText={ (username) => setUsername(username)}
				/>
				<TextInput
					style={styles.textInput} placeholder='Password'
					onChangeText={ (password) => setPassword(password)}
				/>
				<TextInput
					style={styles.textInput} placeholder='Repeat password'
					onChangeText={ (confirmPassword) => setConfirmPassword(confirmPassword)}
				/>
				<TouchableOpacity
					style={styles.btn}
					onPress={() => {
						setData(username,password,confirmPassword);
					}
					}>
					<Text style={styles.registerButton}>Register</Text>
				</TouchableOpacity>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	background: { 
		flex: 1, 
		justifyContent: 'center', 
		alignItems: 'center',
		backgroundColor: 'red',
		marginHorizontal: '10%',
		marginVertical: '20%',
	},
	registerButton: {
		fontSize: 60, 
		color:'green'
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
	}
});
