import { Building } from '../models/Buildings';
import { Users } from '../models/Users';
import { db, setUserInfo } from './usersTable';

export const createPlayerBuildingsTable = async () => {
	await db.transaction(async (tx) => {
		await tx.executeSql(
			'CREATE TABLE IF NOT EXISTS '
             + 'playerBuildings '
             + '(ID INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, level Integer, image TEXT, playerID Integer);'
		);
	});
};

export const getPlayerBuildings = async (playerID: number, setUserBuildings) => {
	try {
		await db.transaction(async (tx) => {
			await tx.executeSql(
				'SELECT name, level, playerID, image FROM playerBuildings where playerID=?',
				[playerID],
				(tx, results) => {
					const len = results.rows.length;
					if (len > 0) {
						const rawResults = results.rows.raw();
						setUserBuildings(rawResults);
					} 
				}
			);
		});
	} catch (error) {
		console.log(error);
	}
};

export const createPlayerBuildings = async (playerID: number, setUserBuildings) => {
	try {
		await db.transaction(async (tx) => {
			await tx.executeSql(
				'INSERT INTO playerBuildings (name, level, playerID, image) VALUES (?,?,?,?)',
				['Kmetstvo', 1, playerID, 'https://cdn3.vectorstock.com/i/1000x1000/07/42/big-medieval-castle-icon-cartoon-vector-25760742.jpg']
			);
			await tx.executeSql(
				'INSERT INTO playerBuildings (name, level, playerID, image) VALUES (?,?,?,?)',
				['Kazarma', 1, playerID, 'https://icon-library.com/images/barracks-icon/barracks-icon-23.jpg']
			);
			await tx.executeSql(
				'INSERT INTO playerBuildings (name, level, playerID, image) VALUES (?,?,?,?)',
				['Stena', 1, playerID, 'https://img.freepik.com/free-vector/medieval-castle-town-fortress-wall-cartoon-illustration_1441-3819.jpg']
			);
		});
		await getPlayerBuildings(playerID, setUserBuildings);
	} catch (error) {
		console.log(error);
	}
};

export const updatePlayerBuilding = async (building: Building, buildingLevel, setUserBuildings, userInfo: Users) => {
	try {
		await db.transaction(async (tx) => {
			tx.executeSql(
				// 'UPDATE playerBuildings SET level=? WHERE playerID=? AND name=\'Kazarma\'',
				'UPDATE playerBuildings SET level=? WHERE playerID=? AND name=?',
				[building.level+1, building.playerID, building.name]
			);
			tx.executeSql(
				'UPDATE Users SET wood=?, marble=? WHERE ID=?',
				[(userInfo.wood-buildingLevel.wood), 
					(userInfo.marble-buildingLevel.marble),
					(building.playerID)]
			);
		});
		if(building.name==='Kmetstvo') {
			await db.transaction(async (tx) => {
				tx.executeSql(
					'UPDATE Users SET maxPopulation=? WHERE ID=?',
					[(userInfo.maxPopulation+30), building.playerID]
				);
				setUserInfo(buildingLevel, true);
			});
		} else {
			setUserInfo(buildingLevel);
		}
		await getPlayerBuildings(building.playerID, setUserBuildings);
	} catch (error) {
		console.log(error);
	}
};