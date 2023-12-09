import React from "react";
import { Helmet } from 'react-helmet';

const TITLE = 'Account';

class Account extends React.Component {
	render() {
		return (
			<main>
				<Helmet>
					<title> {TITLE} </title>
				</Helmet>
				<div>
					<h1>Register</h1>
					
					<form id="register_form">
						<h2> General </h2>

						<label class="required" for="email">Email:</label>
						<input type="text" id="email" name="email" required/> <br/>
						<label class="required" for="password">Password:</label>
						<input type="password" id="password" name="password" required/> <br/>

						<label class="required" for="firstname">First name:</label>
						<input type="text" id="firstname" name="firstname" required/> <br/>
						<label class="required" for="lastname">Last name:</label>
						<input type="text" id="lastname" name="lastname" required/> <br/>
						<label class="required" for="age">Age:</label>
						<input type="number" id="age" name="age" required/> <br/>

						<h2> Interests </h2>
						<input type="checkbox" id="interests_museums" name="interests_museums"/>
						<label for="interests_museums">Museums</label> <br/>
						<input type="checkbox" id="interests_world_cuisines" name="interests_world_cuisines"/>
						<label for="interests_world_cuisines">World Cuisines</label> <br/>
						<input type="checkbox" id="interests_architecture" name="interests_architecture"/>
						<label for="interests_architecture">Architecture</label> <br/>
						<input type="checkbox" id="interests_cultural_events" name="interests_cultural_events"/>
						<label for="interests_cultural_events">Cultural Events</label> <br/>
						<input type="checkbox" id="interests_nature" name="interests_nature"/>
						<label for="interests_nature">Nature</label> <br/>
						<input type="checkbox" id="interests_shopping" name="interests_shopping"/>
						<label for="interests_shopping">Shopping</label> <br/>
						<input type="checkbox" id="interests_alcohol" name="interests_alcohol"/>
						<label for="interests_alcohol">Alcohol</label> <br/>
						<input type="checkbox" id="interests_music_festivals" name="interests_music_festivals"/>
						<label for="interests_music_festivals">Music Festivals</label> <br/>
						<input type="checkbox" id="interests_history" name="interests_history"/>
						<label for="interests_history">History</label> <br/>
						<input type="checkbox" id="interests_art" name="interests_art"/>
						<label for="interests_art">Art Galleries</label> <br/>
						<input type="checkbox" id="interests_cycling" name="interests_cycling"/>
						<label for="interests_cycling">Cycling Adventures</label> <br/>

						<a class="button" href="#" onclick="document.getElementById('register_form').submit()">Submit</a>
					</form>
				</div>

				<div>
					<h1> Login </h1>
					<form id="login_form">
						<label class="required" for="email2">Email:</label>
						<input type="text" id="email2" name="email2" required/> <br/>
						<label class="required" for="password2">Password:</label>
						<input type="password" id="password2" name="password2" required/> <br/>

						<a class="button" href="#" onclick="document.getElementById('login_form').submit()">Submit</a>
					</form>
				</div>
			</main>
		);

	}		
}
export default Account;

