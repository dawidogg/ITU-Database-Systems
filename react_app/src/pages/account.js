import React, {useState, useEffect} from "react";
import { Helmet } from 'react-helmet';

const TITLE = 'Account';

const interests = ["Museums", "World Cuisines", "Architecture", "Cultural Events", "Nature", "Shopping", "Alcohol", "Music Festivals", "History", "Art Galleries", "Cycling Adventures"];

function checkCompress(booleanArray) {
	let sum = 0;
	for (let i = 0; i < booleanArray.length; i++) {
		if (booleanArray[i]) {
			sum += Math.pow(2, i);
		}
	}
	return sum;
}

function Account(props) {
	const [checkedState, setCheckedState] = useState(
		new Array(interests.length).fill(false)
	);

	const registerSubmit = (e) => {
		e.preventDefault();
		let data = [];
		for (let i = 0; i < 5; i++)
			data.push(e.target[i].value);
		data.push(checkCompress(checkedState));
		console.log(data);

		fetch("http://localhost:8080/register", {
			method: 'POST',
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify(data),
		}).then(response => {
			return response.text();
		}).then(responseData => {
			console.log(responseData);
		});
	};

	const loginSubmit = (e) => {
		e.preventDefault();
		let data = [];
		for (let i = 0; i < 2; i++)
			data.push(e.target[i].value);
		console.log(data);
		
		fetch("http://localhost:8080/login", {
			method: 'POST',
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify(data),
		}).then(response => {
			return response.text();
		}).then(responseData => {
			console.log(responseData);
			if (responseData === 'true') {
				props.onLogin(data);
			} else {
				props.onLogin(null);
			}
		});
	};

	const logout = () => {
		props.onLogin(null);
	};
	
	const deleteAccount = () => {
		fetch("http://localhost:8080/delete_user", {
			method: 'DELETE',
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify(props.user_credentials),
		}).then(response => {
			return response.text();
		}).then(responseData => {
			console.log(responseData);
		});
		props.onLogin(null);
	};
	
	const handleOnChange = (position) => {
		const updatedCheckedState = checkedState.map((item, index) =>
			index === position ? !item : item
		);

		setCheckedState(updatedCheckedState);
	};

	const [history, setHistory] = useState([]);
	const getHistory = () => {
		fetch("http://localhost:8080/user_history", {
			method: 'POST',
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify(props.user_credentials),
		}).then(response => {
			return response.json();
		}).then(responseData => {
			console.log(responseData);
			setHistory(responseData);
		});
	};

	useEffect(() => {
		getHistory();
	}, []);

	function History() {
		return (
			<div>
				<h2> History</h2>
				<table>
					<thead>
						<tr>
							<th>Origin</th>
							<th>Destination</th>
							<th>Days</th>
							<th>Cost</th>
							<th>Time stamp</th>
						</tr>
					</thead>
				
					<tbody>
						{history.map(h => {
							return (
								<tr>
									<td>{h["origin"]} </td>
									<td>{h["destination"]} </td>
									<td>{h["days"]} </td>
									<td>{h["cost"]} </td>
									<td>{h["time_stamp"]} </td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	}

	if (props.user_data == null)
		return (
			<main className="account">
				<Helmet>
					<title> {TITLE} </title>
				</Helmet>
				<div>
					<form onSubmit={registerSubmit}>
						<h1>Register</h1>
						<h2> General </h2>
						<div className="general">
 							<label className="required" htmlFor="email">Email:</label>
							<input type="text" id="email" name="email" required/> 

							<label className="required" htmlFor="password">Password:</label>
							<input type="password" id="password" name="password" required/>

							<label className="required" htmlFor="firstname">First name:</label>
							<input type="text" id="firstname" name="firstname" required/> 

							<label className="required" htmlFor="lastname">Last name:</label>
							<input type="text" id="lastname" name="lastname" required/>

							<label className="required" htmlFor="age">Age:</label>
							<input type="number" id="age" name="age" required/> 
						</div>
						<h2> Interests </h2>
						<ul>
							{interests.map((name, index) => {
								return (
									<li key={index}>
										<input
											type="checkbox"
											id={`custom-checkbox-${index}`}
											name={name}
											value={name}
											checked={checkedState[index]}
											onChange={() => handleOnChange(index)}
										/>
										<label htmlFor={`custom-checkbox-${index}`}>{name}</label>
									</li>
								);
							})}
						</ul>
						<br/>
						<div className="submit">
							<input type="submit" name="Submit"/> 
						</div>
					</form>
				</div>

				<div>
					<form onSubmit={loginSubmit}>
						<h1> Login </h1>
						<h2> &nbsp; </h2>
						<div className="general">
							<label className="required" htmlFor="email2">Email:</label>
							<input type="text" id="email2" name="email2" required/>
							
							<label className="required" htmlFor="password2">Password:</label>
							<input type="password" id="password2" name="password2" required/> 
						</div>
						<br/>
						<div className="submit">
							<input type="submit" name="Submit"/>
						</div>
					</form>
				</div>
			</main>
		);
	else {
		return (
			<main>
				<div className="account_history">
					<h1>Welcome, {props.user_data["first_name"]} {props.user_data["last_name"]}</h1>
					<History />
					
					<div className="logged_in_buttons">
						<button onClick={logout}>Logout</button>
						<button onClick={deleteAccount}>Delete account</button>
					</div>
				</div>
			</main>);
	}
}
export default Account;

