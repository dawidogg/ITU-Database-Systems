import React from "react";
import {NavLink, Link} from "react-router-dom"

class Header extends React.Component {
	render() {
		return(
			<header>
				<h1>Traveling cost estimation</h1>
				<nav>
					<ul>
						<li><NavLink className="button" to="home">Home</NavLink></li>
						<li><NavLink className="button" to="map">Map</NavLink></li>
						<li><NavLink className="button" to="calculator">Calculator</NavLink></li>
						<li><NavLink className="button" to="order">Order</NavLink></li>
						<li><NavLink className="button" to="calendar">Calendar</NavLink></li>
						<li><NavLink className="button" to="admin">Admin</NavLink></li>
						<li><NavLink className="button" to="account">Account</NavLink></li>
					</ul>
				</nav>
			</header>
		);
	}
}

export default Header;
