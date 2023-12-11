import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config();

const pool = mysql.createPool({
	user: process.env.MYSQL_USER,
	host: process.env.MYSQL_HOST,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE
}).promise();

async function getAirports(lim) {
	const [result] = await pool.query(`select * from airports limit ?;`, lim);
	return result;
}	
const airports = await getAirports(1);
console.log(airports);

// import shell from 'shelljs'
// shell.exec('./shell_test.sh');

