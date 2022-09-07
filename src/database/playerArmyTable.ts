import { Users } from '../models/Users';
import { db, setUserInfo } from './usersTable';

export const createPlayerArmyTable = async () => {
	await db.transaction(async (tx) => {
		await tx.executeSql(
			'CREATE TABLE IF NOT EXISTS '
             + 'playerArmy '
             + '(ID INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, number Integer, attack Integer, defense Integer, image TEXT, playerID Integer, wood Integer, marble Integer);'
		);
	});
};

export const getPlayerArmy = async (playerID: number, setUserArmy) => {
	try {
		await db.transaction(async (tx) => {
			await tx.executeSql(
				'SELECT * FROM playerArmy WHERE playerID=?',
				[playerID],
				(tx, results) => {
					const len = results.rows.length;
					if (len > 0) {
						const rawResults = results.rows.raw();
						setUserArmy(rawResults);
					} 
				}
			);
		});
	} catch (error) {
		console.log(error);
	}
};

export const createPlayerArmy = async (playerID: number) => {
	try {
		await db.transaction(async (tx) => {
			await tx.executeSql(
				'INSERT INTO playerArmy (name, attack, defense, number, playerID, image, wood, marble) VALUES (?,?,?,?,?,?,?,?)',
				['Ricar', 8, 4, 0, playerID, 'https://cdn3.vectorstock.com/i/1000x1000/42/07/cartoon-medieval-knight-with-shield-and-spear-vector-23114207.jpg', 10, 10]
			);
			await tx.executeSql(
				'INSERT INTO playerArmy (name, attack, defense, number, playerID, image, wood, marble) VALUES (?,?,?,?,?,?,?,?)',
				['Konnik', 3, 12, 0, playerID, 'https://images.fineartamerica.com/images-medium-large-5/knight-riding-horse-sword-cartoon-aloysius-patrimonio.jpg', 15, 30]
			);
			await tx.executeSql(
				'INSERT INTO playerArmy (name, attack, defense, number, playerID, image, wood, marble) VALUES (?,?,?,?,?,?,?,?)',
				['Strelec', 10, 1, 0, playerID, 'https://img.freepik.com/premium-vector/cute-archer-cartoon-character_257245-50.jpg?w=2000', 40, 10]
			);
		});
	} catch (error) {
		console.log(error);
	}
};

export const updatePlayerArmy = async (unit, newUnitsNumber: number, userInfo: Users, wood: number, marble: number, setUserArmy) => {
	try {
		await db.transaction(async (tx) => {
			tx.executeSql(
				'UPDATE playerArmy SET number=? WHERE playerID=? AND name=?',
				[unit.number+newUnitsNumber, unit.playerID, unit.name]
			);
			tx.executeSql(
				'UPDATE Users SET wood=?, marble=?, population=? WHERE ID=?',
				[(userInfo.wood-wood), 
					(userInfo.marble-marble),
					(userInfo.population+newUnitsNumber),
					(unit.playerID)]
			);
			setUserInfo({wood, marble}, false, newUnitsNumber);
		});
		await getPlayerArmy(unit.playerID, setUserArmy);
	} catch (error) {
		console.log(error);
	}
};