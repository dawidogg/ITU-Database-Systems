import React, {useState, useEffect} from "react";
import {NavLink, Link} from "react-router-dom"
import user_icon from "../images/user_icon.png";
import voyify_logo from "../images/voyify-transparent.png";

export default function Header(props) {
	return(
		<header>
			<img src={voyify_logo} />
			<nav>
				<ul>
					<li><NavLink className="button" to="home"><img/>Home</NavLink></li>
					<li><NavLink className="button" to="map"><img/>Map</NavLink></li>
					<li><NavLink className="button" to="calculator"><img/>Calculator</NavLink></li>
					<li><NavLink className="button" to="order"><img/>Order</NavLink></li>
					<li><NavLink className="button" to="admin"><img/>Admin</NavLink></li>
					<li><NavLink className="button_img" to="account"><img src={user_icon}/> {props.account_name}</NavLink></li>
				</ul>
			</nav>
		</header>
	);
}

