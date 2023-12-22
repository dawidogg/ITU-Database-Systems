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
		console.log(e.message);
		return false;
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
		console.log(e.message);
		return false;
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

export async function deleteUser(login_data) {
	try {
		const authentificated = await login(login_data);
		if (authentificated) {
			const [result] = await pool.query(
				`delete from users where email=?;`,	   
				login_data[0]
			);
			return result;
		}
	} catch(e) {
		console.log(e.message);
		return false;
	}
}

export async function getAirlines(source_id, destination_id) {
	try {
		const [result] = await pool.query(
			`select airlines.name, airlines.icao, airline_costs.category
			from routes, airlines, airline_costs
			where 
			airlines.id = routes.airline_id and
			airline_costs.id = routes.airline_id and
			routes.src_airport_id=? and
			routes.dest_airport_id=?;`,
			[source_id, destination_id]
		);
		return result;
	} catch(e) {
		console.log(e.message);
		return false;
	} 
}

// export async function getCityCountry(airport_id) {
// 	try {
// 		const [result] = await pool.query(
// 			`select city, country from airports
// 			where id = ?`,
// 			airport_id
// 		);
// 		return result;
// 	} catch(e) {
// 		console.log(e.message);
// 		return false;
// 	}  	
// }

export async function getRoutes(source_id, destination_id, lim) {
	try {
		const [result] = await pool.query(
			`select ? into @source;
			select ? into @destination;
				   
			with intermediate as
			(select distinct 
					lvl0.src_airport_id as a0,
				    lvl1.src_airport_id as a1,
				    case when (
				     lvl0.dest_airport_id = @destination
				    ) then -1
				    else lvl2.src_airport_id end as a2,
				    case when (
				     lvl0.dest_airport_id = @destination or
				     lvl1.dest_airport_id = @destination
				    ) then -1
				    else lvl2.dest_airport_id end as a3,
				  case
					when lvl0.dest_airport_id = @destination then (
						select distance_between_airports(lvl0.src_airport_id, lvl0.dest_airport_id)
					)
					when lvl1.dest_airport_id = @destination then (
						(select distance_between_airports(lvl0.src_airport_id, lvl0.dest_airport_id)) +
						(select distance_between_airports(lvl1.src_airport_id, lvl1.dest_airport_id))			
					)
					when lvl2.dest_airport_id = @destination then (
						(select distance_between_airports(lvl0.src_airport_id, lvl0.dest_airport_id)) +
						(select distance_between_airports(lvl1.src_airport_id, lvl1.dest_airport_id)) +
						(select distance_between_airports(lvl2.src_airport_id, lvl2.dest_airport_id))
					)
					else 2147483647
				   end as distance
			from routes as lvl0
			left join routes as lvl1 on lvl0.dest_airport_id = lvl1.src_airport_id
			left join routes as lvl2 on lvl1.dest_airport_id = lvl2.src_airport_id
			where (lvl0.src_airport_id = @source and lvl0.dest_airport_id = @destination) or
				  (lvl0.src_airport_id = @source and lvl1.dest_airport_id = @destination) or
			      (lvl0.src_airport_id = @source and lvl2.dest_airport_id = @destination)
			order by distance
			limit ?)
			select intermediate.distance,
				   a0.city as 'airport0_city', a0.country as 'airport0_country',
				   a1.city as 'airport1_city', a1.country as 'airport1_country', 
				   a2.city as 'airport2_city', a2.country as 'airport2_country', 
				   a3.city as 'airport3_city', a3.country as 'airport3_country',
				   intermediate.a0 as 'airport0_id',
				   intermediate.a1 as 'airport1_id',
				   intermediate.a2 as 'airport2_id',
				   intermediate.a3 as 'airport3_id'
			from airports a0, airports a1, airports a2, airports a3, intermediate
			where (a0.id = intermediate.a0 and
					  a1.id = intermediate.a1 and
					  a2.id = intermediate.a2 and
					  a3.id = intermediate.a3);	`
			[source_id, destination_id, lim])
			return result;
		} catch(e) {
			console.log(e.message);
			return false;
		}
}

export async function getPlaneOffers(source_id, destination_id) {
	const routes = await getRoutes(source_id, destination_id, 20);
	for (r of routes) {
		
	}
	return false;
}
