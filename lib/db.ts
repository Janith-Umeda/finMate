import * as SQLite from 'expo-sqlite';

let db: Promise<SQLite.SQLiteDatabase> | null = null;

async function getDB(): Promise<SQLite.SQLiteDatabase> {
    return SQLite.openDatabaseAsync('databaseName');
    // if(!db){ 

    //     return db
    // }

    // return db
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
            contactTel TEXT
        );
    `);
}

export default getDB;
export { migrate }