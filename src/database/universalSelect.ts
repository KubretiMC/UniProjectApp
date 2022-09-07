import { db } from './usersTable';

export const getAllInfo = async () => {
	try {
		await db.transaction(async (tx) => {
			tx.executeSql(
				'SELECT * FROM playerBuildings WHERE playerID=6',
				[],
				(tx, results) => {
					const len = results.rows.length;
					if (len > 0) {
						const rawResults = results.rows.raw();
						console.log('All player buildings', rawResults);
					} 
				}
			);
			tx.executeSql(
				'SELECT * FROM playerArmy WHERE playerID=6',
				[],
				(tx, results) => {
					const len = results.rows.length;
					if (len > 0) {
						const rawResults = results.rows.raw();
						console.log('All player army', rawResults);
					} 
				}
			);
			tx.executeSql(
				'SELECT * FROM Users WHERE ID=6',
				[],
				(tx, results) => {
					const len = results.rows.length;
					if (len > 0) {
						const rawResults = results.rows.raw();
						console.log('All users', rawResults);
					} 
				}
			);
		});
	} catch (error) {
		console.log(error);
	}
};