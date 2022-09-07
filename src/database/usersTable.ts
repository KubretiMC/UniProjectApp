import { Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { Users } from '../models/Users';
import { createPlayerArmy } from './playerArmyTable';
import { createPlayerBuildings, getPlayerBuildings } from './playerBuildingsTable';

export const db = SQLite.openDatabase(
	{
		name:'gameDB',
		location:'default',
	},
	() => { console.log('');},
	error => { console.log(error); }
);

export const createUsersTable = async () => {
	await db.transaction(async (tx) => {
		await tx.executeSql(
			'CREATE TABLE IF NOT EXISTS '
             + 'Users '
             + '(ID INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, password Text, wood INTEGER, marble INTEGER, population INTEGER, maxPopulation INTEGER, workersMarble INTEGER, workersWood INTEGER, lastUpdated INTEGER);'
		);
	});
};

export const getUserID = async (username: string, setUserBuildings) => {
	try {
		await db.transaction(async (tx) => {
			await tx.executeSql(
				'SELECT ID FROM users where name=? ',
				[username],
				(tx, results) => {
					const len = results.rows.length;
					if (len > 0) {
						const rawResults = results.rows.raw();
						createPlayerBuildings(rawResults[0].ID, setUserBuildings);
						createPlayerArmy(rawResults[0].ID);
					}
				}
			);
		});
	} catch (error) {
		console.log(error);
	}
};


export const getUsernames = async (setUserNamesList) => {
	try {
		await db.transaction(async (tx) => {
			await tx.executeSql(
				'SELECT * FROM Users',
				[],
				(tx, results) => {
					const len = results.rows.length;
					if (len > 0) {
						const rawResults = results.rows.raw();
						const list = rawResults.map((name) => {
							return name.name;
						} );
						setUserNamesList(list);
					}
				}
			);
		});
	} catch (error) {
		console.log(error);
	}
};

export let userInfo: Users; 

export const setUserInfo = (resources, maxPopulation?: boolean, population?) => {
	userInfo.wood=userInfo?.wood-resources.wood;
	userInfo.marble=userInfo?.marble-resources.marble;
	if(maxPopulation){
		userInfo.maxPopulation+=30;
	} else if(population) {
		userInfo.population+=population;
	}
};

const setUpdatedResourses = (wood: number, marble: number, setUserInfo, lastUpdated) => {
	if((userInfo?.wood !==wood || userInfo.marble !== marble) && (userInfo?.lastUpdated && lastUpdated)) {
		userInfo.lastUpdated=lastUpdated;
	}
	if(userInfo?.wood && userInfo.marble) {
		userInfo.wood=wood;
		userInfo.marble=marble;
	}
	setUserInfo(userInfo);
};

const setUpdatedWorkers = (workersWood: number, workersMarble: number, population: number, setUserInfo) => {
	userInfo.workersWood=workersWood;
	userInfo.workersMarble=workersMarble;
	userInfo.population=population;
	setUserInfo(userInfo);
};

function getMinDiff(startDate: number, endDate: number) {
	const difference = endDate - startDate; // This will give difference in milliseconds
	const resultInMinutes = Math.round(difference / 60000);
	return resultInMinutes;
}

export const login = async (username: string, password: string, setUserBuildings) => {
	try {
		await db.transaction(async (tx) => {
			tx.executeSql(
				'SELECT * FROM Users where name=? and password=?',
				[username,password],
				async (tx, results) => {
					const len = results.rows.length;
					if (len > 0) {
						userInfo = results.rows.raw()[0];
						const currentDate =new Date().getTime();
						const minDiff = getMinDiff(userInfo.lastUpdated, currentDate);
						await updateTime(userInfo, minDiff, userInfo);
						await getPlayerBuildings(userInfo.ID, setUserBuildings);
					} else {
						Alert.alert('Warning!', 'Wrong username or password!');
					}
				}
			);
		});
	} catch (error) {
		console.log(error);
	}
};

export const createUser = async (username: string, password: string, setUserBuildings) => {
	const date = new Date().getTime();
	try {
		await db.transaction(async (tx) => {
			await tx.executeSql(
				'INSERT INTO Users (name, password, wood, marble, population, maxPopulation, workersMarble, workersWood, lastUpdated) VALUES (?,?, 1000, 1000, 0, 30, ?, ?, ?)',
				[username, password, 0, 0, date]
			);
		});
		const userID = await getUserID(username, setUserBuildings);
		createPlayerBuildings(userID, setUserBuildings);
		createPlayerArmy(userID);
	} catch (error) {
		console.log(error);
	}
};


export const updateTime = async (userInfo: Users, timeDifference: number, setUserInfo) => {
	const lastUpdated = new Date().getTime();
	const newWood = userInfo?.wood+userInfo.workersWood/60 * timeDifference;
	const newMarble = userInfo.marble+userInfo.workersMarble/60 * timeDifference;
	const newWoodInt = parseInt(newWood.toString(), 10);
	const newMarbleInt= parseInt(newMarble.toString(), 10);
	try {
		await db.transaction(async (tx) => {
			await db.transaction(async (tx) => {
				tx.executeSql(
					'UPDATE Users SET wood=?, marble=?, lastUpdated=? WHERE ID=?',
					[newWoodInt, newMarbleInt, lastUpdated, userInfo.ID]
				);
				setUpdatedResourses(newWoodInt, newMarbleInt, setUserInfo, lastUpdated);
			});
		});
	} catch (error) {
		console.log(error);
	}
};

export const updateWorkers = async (workersWood:number, workersMarble:number, userInfo:Users, setUserInfo, newPopulation: number) => {
	try {
		await db.transaction(async (tx) => {
			await db.transaction(async (tx) => {
				tx.executeSql(
					'UPDATE Users SET workersWood=?, workersMarble=?, population=? WHERE ID=?',
					[workersWood, workersMarble,newPopulation, userInfo.ID]
				);
				setUpdatedWorkers(workersWood, workersMarble, newPopulation, setUserInfo);
			});
		});
	} catch (error) {
		console.log(error);
	}
};