/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import {
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	useColorScheme,
	View,
	ImageBackground,
	Alert,
	Image,
	TouchableOpacity,
	TextInput
} from 'react-native';
    
import {
	Colors,
} from 'react-native/Libraries/NewAppScreen';
import { updateWorkers, userInfo } from '../../database/usersTable';
import { Users } from '../../models/Users';
export default function Mines({ navigation, route }) {
	const isDarkMode = useColorScheme() === 'dark';
	const [user, setUser] = useState<Users>(userInfo);

	const backgroundStyle = {
		backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
		width: '100%'
	};

	const image = { uri: 'https://img.myloview.com/stickers/two-knight-in-front-of-castle-400-269523630.jpg' };
 
 
	const [workersWood, setWorkersWood] = useState<number>(0);
	const [workersMarble, setWorkersMarble] = useState<number>(0);
	const [trigger, setTrigger] = useState<boolean>(false);
    
	return (
		<SafeAreaView style={backgroundStyle}>
			<StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
			<ImageBackground source={image} resizeMode='stretch' style={styles.image}>
				<ScrollView style={styles.scrollView}>
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
					</View>
					<View style={{backgroundColor: 'green', marginTop:20}}>
						<View
							style={[
								styles.buttonsTable,
							]}
						>
							<View
								style ={{
									justifyContent:'center',
									alignItems:'center'
								}}
								accessibilityLabel="Learn more about this purple button"
							>
								<Text style={{fontSize: 30, color:'yellow'}}>Wood gatherers : {user?.workersWood}</Text>
								<Image
									source={
										{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfJ6tRY6Ha7so2s7oW8ERJDpSzCPExTgRQIQ&usqp=CAU'}
									}
              
									style={styles.cardImage}
								/>
							</View>
						</View>
						<View
							style={[{
								flexDirection: 'row',
								justifyContent: 'center',
								width: 400,
								marginBottom: 20,
								borderRadius: 10,
							}]}
						>
							<TextInput
								placeholder={'0'}
								style={{
									backgroundColor:'orange', 
									width:100, 
									textAlign:'center'
								}}
								onChangeText={(text) => {
									const number : number = +text;
									setWorkersWood(number);
								}}
							/>
						</View>
						<TouchableOpacity style={{width:90, alignSelf:'center', marginBottom:10}} 
							onPress={() => {
								let newPopulation = userInfo.population;
								if(user.workersWood > workersWood) {
									newPopulation -= userInfo.workersWood - workersWood;
								} else if(user.workersWood < workersWood) {
									newPopulation += workersWood - user.workersWood;
								}
								if(newPopulation > user.maxPopulation) {
									Alert.alert('Warning!', 'Not enough population!');
								} else {
									updateWorkers(workersWood, user.workersMarble, user, setUser, newPopulation);
									setTimeout(() => {
										setTrigger(!trigger);
									}, 1000);
								}
							}}
						>
							<Text style={{fontSize: 24,marginLeft:20,textAlign:'center', color:'red', backgroundColor:'blue'}}>Set</Text>	
						</TouchableOpacity>	
					</View>

					<View style={{backgroundColor: 'green', marginTop:20}}>
						<View
							style={[
								styles.buttonsTable,
							]}
						>
							<View
								style ={{
									justifyContent:'center',
									alignItems:'center'
								}}
								accessibilityLabel="Learn more about this purple button"
							>
								<Text style={{fontSize: 30, color:'yellow'}}>Marble gatherers : {user?.workersMarble}</Text>
								<Image
									source={
										{uri: 'https://thumbs.dreamstime.com/z/medieval-man-stone-worker-big-long-hammer-medieval-man-stone-worker-big-long-hammer-dirty-clothes-cartoon-style-152453685.jpg'}
									}
              
									style={styles.cardImage}
								/>
							</View>
						</View>
						<View
							style={[{
								flexDirection: 'row',
								justifyContent: 'center',
								width: 400,
								marginBottom: 20,
								borderRadius: 10,
							}]}
						>
							<TextInput
								placeholder={'0'}
								style={{
									backgroundColor:'orange', 
									width:100, 
									textAlign:'center'
								}}
								onChangeText={(text) => {
									const number : number = +text;
									setWorkersMarble(number);
								}}
							/>
						</View>
						<TouchableOpacity style={{width:90, alignSelf:'center', marginBottom:10}} 
							onPress={() => {
								let newPopulation = userInfo.population;
								if(user.workersMarble > workersMarble) {
									newPopulation -= userInfo.workersMarble - workersMarble;
								} else if(user.workersMarble < workersMarble) {
									newPopulation += workersMarble - user.workersMarble;
								}
								if(newPopulation > user.maxPopulation) {
									Alert.alert('Warning!', 'Not enough population!');
								} else {
									updateWorkers(user.workersWood, workersMarble, user, setUser, newPopulation);
									setTimeout(() => {
										setTrigger(!trigger);
									}, 2000);
								}
							}}
						>
							<Text style={{fontSize: 24,marginLeft:20,textAlign:'center', color:'red', backgroundColor:'blue'}}>Set</Text>	
						</TouchableOpacity>	
					</View>
				</ScrollView>
			</ImageBackground>
		</SafeAreaView>
	);
}
    
const styles = StyleSheet.create({
	image: {
		alignSelf:'center',
		width: '100%',
		height: 750,
	},
	table: {
		flexDirection: 'row',
		marginHorizontal:'10%',
		justifyContent:'space-evenly'
	},
	resourse: {
		fontSize: 24,
		alignSelf: 'center',
		color: 'blue'
	},
	scrollView: {
		marginHorizontal: 10,
		marginBottom: 80,
	},
	buttonsTable : {
		flexDirection: 'row',
		justifyContent: 'space-around',
		height: 280,
		width:400,
		borderRadius:10,
	},
	cardImage: {
		height: 200,
		width: 140,
		resizeMode: 'stretch',
	},
});
    