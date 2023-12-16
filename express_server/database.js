import mysql from 'mysql2'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt';

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
// const airports = await getAirports(1);
// console.log(airports);

async function hashPassword(password) {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		return hashedPassword;
	} catch (error) {
		throw new Error('Password hashing failed');
	}
}

const hashed = await hashPassword("denis");
const isMatch = await bcrypt.compare("denis", hashed);

export async function newUser(user_data) {
	try {
		if (user_data[1].length < 5)
			throw new Error("Password shorter than 5 characters");
		const hashed_password = await hashPassword(user_data[1]);
		const [result] = await pool.query(
			`insert into users values
		(?, ?, ?, ?, ?, ?);`,
			[user_data[0], hashed_password, user_data[2], user_data[3],
			 parseInt(user_data[4]), parseInt(user_data[5])]
		);
		return result;
	} catch(e) {
		return e.message;
	}
}

export async function login(login_data) {
	try {
		const [[result]] = await pool.query(
			`select password_hash from users where email=?;`,
			login_data[0]
		);
		const isMatch = await bcrypt.compare(login_data[1], result["password_hash"]);
		return isMatch;
	} catch(e) {
		return e.message;
	}
}

export async function getUser(login_data) {
	try {
		const authentificated = await login(login_data);
		if (authentificated) {
			const [[result]] = await pool.query(
				`select email, first_name, last_name, age, interests
				 from users where email=?;`,	   
				login_data[0]
			);
			return result;
		}
	} catch(e) {
		return e.message;
	}
}

export async function getUserHistory(login_data) {
	try {
		const authentificated = await login(login_data);
		if (authentificated) {
			const [[result]] = await pool.query(
				`select * from user_history where email=?;`,	   
				login_data[0]
			);
			return result;
		}
	} catch(e) {
		return e.message;
	}
}
