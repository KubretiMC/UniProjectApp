import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/screens/Home/home.screen';
import Login from './src/screens/Login/login.screen';
import Army from './src/screens/Army/army.screen';
import Buildings from './src/screens/Buildings/buildings.screen';
import Mines from './src/screens/Mines/mines.screen';

const Stack = createStackNavigator();

function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName="Login"
				screenOptions={{
					headerTitleAlign: 'center',
					headerStyle: {
						backgroundColor: '#0080ff'
					},
					headerTintColor: '#ffffff',
					headerTitleStyle: {
						fontSize: 25,
						fontWeight: 'bold'
					}
				}}
			>
				<Stack.Screen
					name="Login"
					component={Login}
					options={{
						headerShown: false
					}}
				/>
				<Stack.Screen
					name="Home"
					component={Home}
				/>
				<Stack.Screen
					name="Army"
					component={Army}
				/>
				<Stack.Screen
					name="Buildings"
					component={Buildings}
				/>
				<Stack.Screen
					name="Mines"
					component={Mines}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default App;