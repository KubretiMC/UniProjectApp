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
	TouchableOpacity
} from 'react-native';
  
import {
	Colors,
} from 'react-native/Libraries/NewAppScreen';
import { buildingsInfo } from '../../database/buildingsTable';
import { getPlayerBuildings, updatePlayerBuilding } from '../../database/playerBuildingsTable';
import { userInfo } from '../../database/usersTable';
import { Building } from '../../models/Buildings';
export default function Buildings({ navigation, route }) {
	const isDarkMode = useColorScheme() === 'dark';
	const { buildings } = route.params;
	const [userBuildings, setUserBuildings] = useState<Building[]>(buildings);

	useEffect(() => {
		getPlayerBuildings(buildings[0].playerID, setUserBuildings);
	}, []);
	const backgroundStyle = {
		backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
		width: '100%'
	};

	const image = { uri: 'https://img.myloview.com/stickers/two-knight-in-front-of-castle-400-269523630.jpg' };

	const buildingsList = userBuildings?.map((building, index) => {
		const buildingName = buildingsInfo.find(name => 
			name.name === building.name 
		);

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
						<Text style={{fontSize: 30, color:'yellow'}}>{building.name}</Text>
						<Image
							source={
								{uri: building.image}
							}
			
							style={styles.cardImage}
						/>
						<Text style={{fontSize: 30, color:'yellow'}}>Level : {building.level}</Text>
					</View>
					{building.level === 5 ? 
						<Text style ={{
							alignSelf:'center',
							fontSize:21,
							color:'orange',
							fontWeight:'bold'
						}}>Max Level</Text>
						: 
						<View
							style ={{
								justifyContent:'center',
								alignItems:'center'
							}}
						>
							<Text style={{fontSize: 21, color:'yellow'}}>Wood {buildingName?.levels[building.level+1].wood}</Text>
							<Text style={{fontSize: 21, color:'yellow'}}>Marble {buildingName?.levels[building.level+1].marble}</Text>
							<TouchableOpacity style={{width:120}} onPress={() => {
								if(userInfo?.wood-buildingName?.levels[building.level+1].wood<0){
									Alert.alert('Warning!', 'Not enough wood!');
								} else if(userInfo.marble-buildingName?.levels[building.level+1].marble<0) {
									Alert.alert('Warning!', 'Not enough marble!');
								} else {
									updatePlayerBuilding(building, buildingName?.levels[building.level+1], setUserBuildings, userInfo);}
							}
							}
							>
								<Text style={{fontSize: 24,marginTop:10,textAlign:'center', color:'red', backgroundColor:'blue'}}>Upgrade</Text>	
							</TouchableOpacity>	
						</View>
					}
				</View>
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
					{buildingsList}
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
});
  