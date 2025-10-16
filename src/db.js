// import mysql from "mysql2/promise";

// export const db = await mysql.createConnection({
//   host: process.env.MYSQLHOST || "mysql.railway.internal",
//   port: process.env.MYSQLPORT || 3306,
//   user: process.env.MYSQLUSER || "root",
//   password: process.env.MYSQLPASSWORD || "UCnxlZAEgtJdRSAsnNzyxTdYPbAmnfME",
//   database: process.env.MYSQLDATABASE || "railway",
// });

import sqlite3 from "sqlite3";
import { open } from "sqlite";

// создаём и открываем локальную базу
export const db = await open({
  filename: "./data.db",
  driver: sqlite3.Database,
});

// создаём таблицу, если нет
await db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    number TEXT,
    type TEXT,
    price REAL,
    date TEXT
  );
`);
