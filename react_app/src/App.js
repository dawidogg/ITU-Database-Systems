import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"

// Import pages
import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./pages/home";
import Map from "./pages/map";
import Calculator from "./pages/calculator";
import Order from "./pages/order";
import Calendar from "./pages/calendar";
import Admin from "./pages/admin";
import Account from "./pages/account";
import "./App.css"

function App() {
	const [backendData, setBackendData] = useState([{}])

	fetch("http://localhost:8080/register", {
		method: 'POST',
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify(["One", "Two", "Three"])
	}).then(() => {
		console.log("Registered");
	});

	return (
		<div>
			<Router>
				<Header />
				<Routes>
					<Route path='/' element={<Home/>}/>
					<Route path='/home' element={<Home/>}/>
					<Route path='/map' element={<Map/>}/>
					<Route path='/calculator' element={<Calculator/>}/>
					<Route path='/order' element={<Order/>}/>
					<Route path='/calendar' element={<Calendar/>}/>
					<Route path='/admin' element={<Admin/>}/>
					<Route path='/account' element={<Account/>}/>
				</Routes>
			</Router>
		</div>
	);
}

export default App;
