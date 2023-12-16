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

function Account() {
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
		});

	};

	const handleOnChange = (position) => {
		const updatedCheckedState = checkedState.map((item, index) =>
			index === position ? !item : item
		);

		setCheckedState(updatedCheckedState);
	};


	return (
		<main>
			<Helmet>
				<title> {TITLE} </title>
			</Helmet>
			<div>
				<h1>Register</h1>
				
				<form onSubmit={registerSubmit}>
					<h2> General </h2>

 					<label className="required" htmlFor="email">Email:</label>
					<input type="text" id="email" name="email" required/> <br/>
					<label className="required" htmlFor="password">Password:</label>
					<input type="password" id="password" name="password" required/> <br/>

					<label className="required" htmlFor="firstname">First name:</label>
					<input type="text" id="firstname" name="firstname" required/> <br/>
					<label className="required" htmlFor="lastname">Last name:</label>
					<input type="text" id="lastname" name="lastname" required/> <br/>
					<label className="required" htmlFor="age">Age:</label>
					<input type="number" id="age" name="age" required/> <br/>

					<h2> Interests </h2>
					<ul>
					{interests.map((name, index) => {
						return (
							<li key={index}>
								<div className="interests-list-item">
									<input
										type="checkbox"
										id={`custom-checkbox-${index}`}
										name={name}
										value={name}
										checked={checkedState[index]}
										onChange={() => handleOnChange(index)}
									/>
									<label htmlFor={`custom-checkbox-${index}`}>{name}</label>
								</div>
							</li>
						);
					})}
					</ul>
					<input type="submit" name="Submit"/> 
				</form>
			</div>

			<div>
				<h1> Login </h1>
				<form onSubmit={loginSubmit}>
					<label className="required" htmlFor="email2">Email:</label>
					<input type="text" id="email2" name="email2" required/> <br/>
					<label className="required" htmlFor="password2">Password:</label>
					<input type="password" id="password2" name="password2" required/> <br/>
					<input type="submit" name="Submit"/> 
				</form>
			</div>
		</main>
	);


}
export default Account;

