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
			const [result] = await pool.query(
				`select CONCAT(src.city, ", ", src.country) as origin,
					   CONCAT(dest.city, ", ", dest.country) as destination,
					   days, cost, date_format(time_stamp, '%Y-%m-%d %H:%i:%s') as "time_stamp"
				from user_history, airports src, airports dest
				where src.id = origin_airport_id and
					  dest.id = destination_airport_id and
					  email = ?;`,
				login_data[0]
			);
			return result;
		}
	} catch(e) {
		return e.message;
	}
}

export async function postUserHistory(data) {
	try {
		const login_data = data[0];
		const authentificated = await login(login_data);
		if (authentificated) {
			const [result] = await pool.query(
				`insert into user_history (email, origin_airport_id,
				destination_airport_id, days, cost)
				values (?, ?, ?, ?, ?);`, 
				[login_data[0], data[1], data[2], data[3], data[4]]);
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
		console.log("getAirlines: "+e.message);
		return false;
	} 
}

export async function getRoutes(source_id, destination_id, lim) {
	try {
		await pool.query(`select ? into @source;`, source_id);
		await pool.query(`select ? into @destination;`, destination_id);
		const [result] = await pool.query(
			`with intermediate as
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
					  a3.id = intermediate.a3);`,
			lim);
			return result;
		} catch(e) {
			console.log("getRoutes: "+e.message);
			return false;
		}
}

export async function getDistanceAirports(source_id, destination_id) {
	try {
		let [result] = await pool.query(
			`select distance_between_airports(?, ?);`,
			[source_id, destination_id]
		);
		result = (Object.values(result[0]))[0];
		return result;
	} catch(e) {
		console.log("getDistanceAirports: "+e.message);
		return false;
	} 
}

function getPlanePrice(category, distance) {
	return Math.floor((1/(category*category+5) * distance/100));
}

const INDIRECT1_MAX = 5;
const INDIRECT2_MAX = 5;

const shuffle = (array) => { 
  for (let i = array.length - 1; i > 0; i--) { 
    const j = Math.floor(Math.random() * (i + 1)); 
    [array[i], array[j]] = [array[j], array[i]]; 
  } 
  return array; 
};

export async function getPlaneOffers(source_id, destination_id) {
	const routes = await getRoutes(source_id, destination_id, 20);
	let cards0 = [];
	let cards1 = [];
	let cards2 = [];
	for (let r of routes) {
		let flight_count = -1;
		for (let i = 0; i <= 3; i++)
			if (r["airport"+i.toString()+"_id"] != -1)
				flight_count++;
		r["flight_count"] = flight_count;

		let route_cities = [];
		for (let i = 0; i <= flight_count; i++)
			route_cities.push(r["airport"+i+"_city"])
		const distance0 = await getDistanceAirports(r["airport0_id"], r["airport1_id"]);
		const distance1 = await getDistanceAirports(r["airport1_id"], r["airport2_id"]);
		const distance2 = await getDistanceAirports(r["airport2_id"], r["airport3_id"]);
		const airlines0 = await getAirlines(r["airport0_id"], r["airport1_id"]);
		const airlines1 = await getAirlines(r["airport1_id"], r["airport2_id"]);
		const airlines2 = await getAirlines(r["airport2_id"], r["airport3_id"]);

		if (airlines2 === false && flight_count == 3) 
			flight_count == 2;
		if (airlines1 === false && flight_count == 2) 
			flight_count == 1;
		if (airlines0 === false && flight_count == 1) 
			flight_count == 0;

		// Card({count, airline_name, airline_code, route, price})
		if (flight_count == 1) {
			for (let j = 0; j < airlines0.length; j++) {
				let card = [];
				card.push(1);
				card.push([airlines0[j]["name"]]);
				card.push([airlines0[j]["icao"]]);
				card.push(route_cities);
				card.push(getPlanePrice(airlines0[j]["category"], distance0));
				cards0.push(card);
			}
		}

		if (flight_count == 2) {		
			let pairs = [];
			for (let i = 0; i < airlines0.length; i++)
				for (let j = 0; j < airlines1.length; j++)
					pairs.push([i, j]);
			shuffle(pairs);
			for (let i = 0; cards1.length < INDIRECT1_MAX && i < pairs.length; i++) {
				const x = pairs[i][0];
				const y = pairs[i][1];
				let card = [];
				card.push(2);
				card.push([airlines0[x]["name"], airlines1[y]["name"]]);
				card.push([airlines0[x]["icao"], airlines1[y]["icao"]]);
				card.push(route_cities);
				card.push(getPlanePrice(airlines0[x]["category"], distance0)+
						  getPlanePrice(airlines1[y]["category"], distance1));
				cards1.push(card);
			}
		}

		if (flight_count == 3) {
			let pairs = [];
			for (let i = 0; i < airlines0.length; i++)
				for (let j = 0; j < airlines1.length; j++)
					for (let k = 0; k < airlines2.length; k++)
						pairs.push([i, j, k]);
			shuffle(pairs);
			for (let i = 0; cards2.length < INDIRECT2_MAX && i < pairs.length; i++) {
				const x = pairs[i][0];
				const y = pairs[i][1];
				const z = pairs[i][2];
				let card = [];
				card.push(3);
				card.push([airlines0[x]["name"], airlines1[y]["name"], airlines2[z]["name"]]);
				card.push([airlines0[x]["icao"], airlines1[y]["icao"], airlines2[z]["icao"]]);
				card.push(route_cities);
				card.push(getPlanePrice(airlines0[x]["category"], distance0)+
						  getPlanePrice(airlines1[y]["category"], distance1)+
						  getPlanePrice(airlines2[z]["category"], distance2));
				cards2.push(card);
			}
		}

	}
	let result = cards0.concat(cards0, cards1, cards2);
	return result;
}

export async function getCityCountry(airport_id) {
	try {
		const [result] = await pool.query(
			`select city, country from airports
			where id = ?`,
			airport_id
		);
		return result;
	} catch(e) {
		console.log(e.message);
		return false;
	}  	
}

export async function closestAirports(position) {
	try {
		const [[result]] = await pool.query(
			`select id, latitude as lat, longitude as lng, name
			from airports	 
			where id = closest_airport(?, ?);`,
			[position["lat"], position["lng"]]
		);
		return result;
	} catch(e) {
		console.log(e.message);
		return false;
	}  	

}
