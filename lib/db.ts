import * as SQLite from 'expo-sqlite';

async function getDB(): Promise<SQLite.SQLiteDatabase> {
    return await SQLite.openDatabaseAsync('databaseName');
}

async function migrate() {
    const db = await getDB();

    await db.runAsync(`
        CREATE TABLE IF NOT EXISTS users (
            userId INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT
        );
    `);


    await db.runAsync(`
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            amount REAL,
            type TEXT, -- 'income' or 'expense'
            category TEXT,
            note TEXT,
            date TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );`
    );

    await db.runAsync(`
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            contactName TEXT,
            contactTel INTEGER
        );`
    );
}

export default getDB;
export { migrate }