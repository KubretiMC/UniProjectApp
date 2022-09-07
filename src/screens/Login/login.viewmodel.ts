import { useEffect, useState } from 'react';
import { Alert, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { createUser, createUsersTable, getUsernames, login } from '../../database/usersTable';
import { createPlayerBuildingsTable } from '../../database/playerBuildingsTable';
import { createPlayerArmyTable } from '../../database/playerArmyTable';
import { Building } from '../../models/Buildings';

interface ILoginScreenProps {
    login: (username: string, password: string, navigation: any) => void, 
    setData: (username:string, password:string, confirmPassword: string) => void,
    isDarkMode: boolean,
    backgroundStyle: {
        backgroundColor: any;
        width: string;
    },
    image: {
        uri: string;
    },
    username: string,
    setUsername: (username: string) => void;
    password: string, 
    setPassword: (password: string) => void;
    modalVisible: boolean,
    setModalVisible: (modalVisible: boolean) => void;
	setUserBuildings: (userBuildings: Building) => void;
  }
export function loginViewModel({navigation}): [ILoginScreenProps] {
	const isDarkMode = useColorScheme() === 'dark';
	const [userBuildings, setUserBuildings] = useState<any>();
 
	const backgroundStyle = {
		backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
		// height:'70%',
		width: '100%'
	};
 
	const image = { uri: 'https://img.myloview.com/stickers/two-knight-in-front-of-castle-400-269523630.jpg' };
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
 
	const [modalVisible, setModalVisible] = useState(false);
	const [userNamesList, setUserNamesList] = useState<string[]>([]);

	useEffect(() => {
		createUsersTable();
		getUsernames(setUserNamesList);
		createPlayerBuildingsTable();
		createPlayerArmyTable();
		// getAllInfo(); testing purpose
	}, []);
	
	const isUserTaken = (username) => {
		if(userNamesList.some(name => name === username)){
			return true;
		}
		const newList = userNamesList;
		newList.push(username);
		setUserNamesList(newList);
		return false;
	};
 
	const setData = async (username, password, confirmPassword) => {
		if (username.length == 0 || password.length == 0) {
			Alert.alert('Warning!', 'Please write your data!');
		} else if(password !== confirmPassword) {
			Alert.alert('Warning!', 'Passwords dont match!');
		} else if(isUserTaken(username)) {
			Alert.alert('Warning!', 'Username taken!');
		} else {
			try {
				createUser(username,password, setUserBuildings);
				login(username, password, setUserBuildings);
				setModalVisible(false);
			} catch (error) {
				console.log(error);
			}
		}
	};

	useEffect(() => {
		if(userBuildings){
			setTimeout(() => {
				navigation.navigate('Home',  {buildings : userBuildings});
			}, 1000);
		}
	}, userBuildings);
 
	return [
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
	];
}
