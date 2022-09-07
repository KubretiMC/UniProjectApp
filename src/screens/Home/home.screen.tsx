/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import {
	SafeAreaView,
	StatusBar,
	StyleSheet,
	Text,
	useColorScheme,
	View,
	ImageBackground,
} from 'react-native';
 
import {
	Colors,
} from 'react-native/Libraries/NewAppScreen';
import { updateTime, userInfo } from '../../database/usersTable';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Users } from '../../models/Users';
import Icon from 'react-native-vector-icons/FontAwesome';
 
export default function Home({ navigation, route }) {
	const { buildings } = route.params;
	const isDarkMode = useColorScheme() === 'dark';
	const [user, setUser] = useState<Users>(userInfo);
	const [trigger, setTrigger] =useState<boolean>(false);
 
	const backgroundStyle = {
		backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
		width: '100%'
	};
	const myIcon = <Icon 
		name="refresh" 
		size={35} 
		color="red" 
		onPress={() => {
			const currentDate =new Date().getTime();
			const minDiff = getMinDiff(user.lastUpdated, currentDate);
			updateTime(user, minDiff, updateUser);
		}} />;
	const image = { uri: 'https://img.myloview.com/stickers/two-knight-in-front-of-castle-400-269523630.jpg' };

	function getMinDiff(startDate: number, endDate) {
		const difference = endDate - startDate; // This will give difference in milliseconds
		const resultInMinutes = Math.round(difference / 60000);
		return resultInMinutes;
	}

	useEffect(() => {
		const currentDate =new Date().getTime();
		const minDiff = getMinDiff(user.lastUpdated, currentDate);
		updateTime(user, minDiff, setUser);
	}, []);

	const updateUser = (user) => {
		setUser(user);
		setTrigger(!trigger);
	};
	
	const isFocused = useIsFocused();
	return (
		<SafeAreaView style={backgroundStyle}>
			<StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
			<ImageBackground source={image} resizeMode='stretch' style={styles.image}>
				<View
					style={[
						styles.table,
					]}
				>
					<Text style={styles.nickname}>{user?.name}</Text>
					<View style={{marginTop:25}}>
						{myIcon}
					</View>
				</View>
				{isFocused &&
				<View
					style={[
						styles.table,
					]}
				>
					<View>
						<Text style={styles.resourse}>Wood</Text>
						<Text style={styles.resourse}>	{user?.wood}</Text>
					</View>
					<View>			
						<Text style={styles.resourse}>
							Marble
						</Text>
						<Text style={styles.resourse}>
							{user?.marble}
						</Text>
					</View>
					<View>
						<Text style={styles.resourse}>Population</Text>
						<Text style={styles.resourse}>	{user?.population}/{user?.maxPopulation}</Text>
					</View>
				</View>
				}
				<View
					style={[
						styles.buttonsTable,
					]}
				>
					<TouchableOpacity
						onPress={() => navigation.navigate('Army', {playerID : buildings[0].playerID})}
						style ={{
							height: 200,
							width:160,
							borderRadius:10,
							backgroundColor : 'green',
							justifyContent:'center',
							alignItems:'center'
						}}
						accessibilityLabel="Learn more about this purple button"
					>
						<Text style={{fontSize: 30, color:'yellow'}}>Army</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => navigation.navigate('Buildings', {buildings : buildings})}
						style ={{
							height: 200,
							width:160,
							borderRadius:10,
							backgroundColor : 'green',
							justifyContent:'center',
							alignItems:'center'
						}}
						accessibilityLabel="Learn more about this purple button"
					>
						<Text style={{fontSize: 30, color:'yellow'}}>Buildings</Text>
					</TouchableOpacity>
				</View>
				<View
					style={[
						styles.buttonsTable,
					]}
				>
					<TouchableOpacity
						onPress={() => navigation.navigate('Mines', {playerID : buildings[0].playerID})}
						style ={{
							height: 200,
							width:160,
							borderRadius:10,
							backgroundColor : 'green',
							justifyContent:'center',
							alignItems:'center'
						}}
						accessibilityLabel="Learn more about this purple button"
					>
						<Text style={{fontSize: 30, color:'yellow'}}>Mines</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() =>console.log('hi')}
						style ={{
							height: 200,
							width:160,
							borderRadius:10,
							backgroundColor : 'green',
							justifyContent:'center',
							alignItems:'center'
						}}
						accessibilityLabel="Learn more about this purple button"
					>
						<Text style={{fontSize: 30, color:'yellow'}}>Map</Text>
					</TouchableOpacity>
				</View>
			</ImageBackground>
		</SafeAreaView>
	);
}
 
const styles = StyleSheet.create({
	button: {
		width:160,
	},
	nickname: {
		fontSize:60,
		color: 'blue',
		alignSelf: 'center'
	},
	resourse: {
		fontSize: 20,
		alignSelf: 'center',
		color: 'blue'
	},
	row: {
		flexDirection:'row',
		justifyContent:'space-evenly'
	},
	image: {
		alignSelf:'center',
		width: '100%',
		height: 750
	},
	table: {
		flexDirection: 'row',
		marginHorizontal:'10%',
		justifyContent:'space-evenly'
	},
	buttonsTable : {
		flexDirection: 'row',
		marginTop:30,
		justifyContent: 'space-evenly'
	}
});
 