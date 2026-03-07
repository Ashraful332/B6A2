import mysql, { type Pool } from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config();

const connection : Pool = mysql.createPool({
    host: `${process.env.MYSQL_HOST}`, // Your MySQL host
    user: `${process.env.MYSQL_USER}`,      // Your MySQL username
    password: `${process.env.MYSQL_PASSWORD}`, // Your MySQL password
    database: `${process.env.MYSQL_DATABASE}`, // The database you want to use
    waitForConnections: true,
    connectionLimit: 10, // Recommended for larger applications
    queueLimit: 0
});

// module.exports = connection;
export default connection;

