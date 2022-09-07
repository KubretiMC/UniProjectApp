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
import { getPlayerArmy, updatePlayerArmy } from '../../database/playerArmyTable';
import { getPlayerBuildings } from '../../database/playerBuildingsTable';
import { userInfo } from '../../database/usersTable';
import { Armies } from '../../models/Army';
import { Building } from '../../models/Buildings';

export default function Army({ navigation, route }) {
	const isDarkMode = useColorScheme() === 'dark';
	const { playerID } = route.params;
	const [userArmy, setUserArmy] = useState<Armies[]>();
	const [userBuildings, setUserBuildings] = useState<Building[]>();

	useEffect(() => {
		getPlayerArmy(playerID, setUserArmy);
		getPlayerBuildings(playerID, setUserBuildings);
	}, []);

	const backgroundStyle = {
		backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
		width: '100%'
	};

	const image = { uri: 'https://img.myloview.com/stickers/two-knight-in-front-of-castle-400-269523630.jpg' };

	const [totalWood, setTotalWood] = useState({
		wood: [0,0,0],
		marble: [0,0,0]
	});

	const [unitsNumber, setUnitsNumber] = useState<number>(0);

	const armyList = userArmy?.map((army, index) => {
		return (
			<View key={index} style={{backgroundColor: 'green', marginTop:20}}>
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
						<Text style={{fontSize: 30, color:'yellow'}}>{army.name}</Text>
						<Image
							source={
								{uri: army.image}
							}
             
							style={styles.cardImage}
						/>
						<Text style={{fontSize: 30, color:'yellow'}}>{army.number}</Text>
					</View>
					<View
						style ={{
							justifyContent:'center',
						}}
					>
						<Text style={styles.armyStats}>Attack {army.attack}</Text>
						<Text style={styles.armyStats}>Marble {army.defense}</Text>
						<Text style={styles.armyStats}>Wood {army.wood}</Text>
						<Text style={styles.armyStats}>Marble {army.marble}</Text>
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
						placeholder={unitsNumber.toString()}
						style={{
							backgroundColor:'orange', 
							width:40, 
							textAlign:'center'
						}}
						onChangeText={(text) => {
							const number : number = +text;
							setTotalWood((arr) => {
								const newArr = {...arr};	
								newArr.wood[index] = number*army.wood;
								newArr.marble[index] = number*army.marble;
								return newArr;
							});
							setUnitsNumber(number);
						}}
					/>
					<View style={{marginLeft:20}}>
						<Text style={styles.armyStats}>Total wood: {totalWood.wood[index]}</Text>
						<Text style={styles.armyStats}>Total marble: {totalWood.marble[index]}</Text>
					</View>
				</View>
				<TouchableOpacity style={{width:120, alignSelf:'center', marginBottom:10}} 
					onPress={() => {
						if(userInfo?.wood-totalWood.wood[index]<0){
							Alert.alert('Warning!', 'Not enough wood!');
						} else if(userInfo.marble-totalWood.marble[index]<0) {
							Alert.alert('Warning!', 'Not enough marble!');
						} else if(unitsNumber+userInfo.population > userInfo.maxPopulation) {
							Alert.alert('Warning!', 'You dont have enough population!');
						} else if(army.name === 'Konnik' && userBuildings[1].level < 3) {
							Alert.alert('Warning!', 'You need to have Barrack lvl 3 to do Konnik!');
						} else if(army.name === 'Strelec' && userBuildings[1].level < 5) {
							Alert.alert('Warning!', 'You need to have Barrack lvl 5 to do Strelec!');
						} else {
							updatePlayerArmy(army, unitsNumber, userInfo, totalWood.wood[index], totalWood.marble[index], setUserArmy);
							setUnitsNumber(0);
							setTotalWood((arr) => {
								const newArr = {...arr};	
								newArr.wood[index] = 0;
								newArr.marble[index] = 0;
								return newArr;
							});
						}}}
				>
					<Text style={{fontSize: 24,marginTop:10,textAlign:'center', color:'red', backgroundColor:'blue'}}>Upgrade</Text>	
				</TouchableOpacity>	
			</View>
		);
	});
     
   
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
							<Text style={styles.resourse}>	{userInfo?.wood}</Text>
						</View>
						<View>			
							<Text style={styles.resourse}>
                             Marble
							</Text>
							<Text style={styles.resourse}>
								{userInfo?.marble}
							</Text>
						</View>
					</View>
					{armyList}
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
		borderRadius:10
	},
	cardImage: {
		height: 200,
		width: 140,
		resizeMode: 'stretch',
	},
	armyStats: {
		fontSize: 21, 
		color:'yellow'
	}
});
   