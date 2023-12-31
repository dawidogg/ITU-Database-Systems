import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"

// Import pages
import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./pages/home";
import Map from "./pages/map";
import Calculator from "./pages/calculator";
import Order from "./pages/order";
import Admin from "./pages/admin";
import Account from "./pages/account";
import "./App.css"

function App() {
	const [account_name, setAccountName] = useState('Account');
	const [user_data, setUserData] = useState(null);
	const [user_credentials, setUserCredentials] = useState(null);
	const [airport1, setAirport1] = useState(-1);
	const [airport2, setAirport2] = useState(-1);
	
	useEffect(() => {
		if (user_credentials != null) {
			fetch("http://localhost:8080/user_data", {
				method: 'POST',
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(user_credentials),
			}).then(response => {
				return response.json();
			}).then(responseData => {
				console.log(responseData);
				setUserData(responseData);
			});
		} else {
			setUserData(null);
		}
	}, [user_credentials]);

	useEffect(() => {
		if (user_data == null)
			setAccountName('Account');
		else 
			setAccountName(user_data["first_name"]);
	}, [user_data]);
return (
	<div>
		<Router>
			<Header account_name={account_name}/>
			<Routes>
				<Route path='/' element={<Home/>}/>
				<Route path='/home' element={<Home/>}/>
				<Route path='/map' element=
					   {<Map onMarker1={(result) => {setAirport1(result)}} onMarker2={(result) => {setAirport2(result)}}/>}/>
				<Route path='/calculator' element=
					   {<Calculator origin={airport1} destination={airport2} user_credentials={user_credentials}/>}/>
				<Route path='/order' element={<Order/>}/>
				<Route path='/admin' element={<Admin/>}/>
				<Route path='/account' element=
					   {<Account user_data={user_data} user_credentials={user_credentials} onLogin={(result) => {setUserCredentials(result)}}/>}/>
			</Routes>
		</Router>
	</div>
);
}

export default App;
