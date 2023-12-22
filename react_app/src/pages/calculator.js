import React, { useEffect, useState } from "react"
import { Helmet } from 'react-helmet'
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu'
import 'react-horizontal-scrolling-menu/dist/styles.css'
import Arrow from 'react-arrows'
import {Button} from 'react-native';
import { useContext } from 'react';
import plane_right from "../images/plane-right.svg";
import plane_left from "../images/plane-left.svg";

const TITLE = 'Calculator';

export default function Calculator(props) {
	const cities = ["Istanbul-Bucharest", "Bucharest-Chisinau", "Chisinau-Moscow", "Moscow-Paris", "Paris-Istanbul"];
	const airline_names = ["Air Moldova", "Turkish Hairlines", "Pegasus", "Aeroflot", "Air Moldova", "Turkish Hairlines", "Pegasus", "Aeroflot"]
	const airlines = ["MLD","THY","PPL","AFL", "MLD","THY","PPL","AFL"];
	const defaultOption = cities[0];

	const drop_down_change = (e) => {
		console.log("Dropdown changed");
		console.log(e.target.value);
	}

	let airline_logos = {};
	const fetch_airline_logo = async (code) => {
		const response = await fetch('http://localhost:8080/static/airline_logos/'+code+'.png');
		const image = await response.blob();
		const object_url = URL.createObjectURL(image);
		airline_logos[code] = object_url;
		return 0;
	}

	const fetch_all_logos = async () => {
		for (const a of airlines) {
			await fetch_airline_logo(a);
		}
	}

	useEffect(() => {
		fetch_all_logos();
	}, []);

	return (
		<main>
			<Helmet>
				<title> {TITLE} </title>
			</Helmet>
			<div>
				<button onClick={fetch_all_logos}> Load images</button>
				
				<div className="dropdown">
					<label htmlFor="cars">Estimate for stay in </label>

					<select name="cars" id="cars" onChange={drop_down_change}>
						{cities.map((name, index) => {
							return (
								<option value={index} key={index}>{name}</option>
							);
						})}
					</select>
				</div>


				<label htmlFor="days">Number of days: </label>
				<input type="number" id="days" name="days" required/> 

				<ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
					{airline_names.map((name, index) => {
						return (<Card
									itemId={index} 
									airline_name={[name, name]}
									airline_code={[airlines[index], airlines[index]]}
									route={[cities[0], cities[1]]}
									price={150}
									key={index}
								/>)
					})}
				</ScrollMenu>

				<br />
				<button>Save</button>
			</div>
		</main>
	);

	function Card({itemId, airline_name, airline_code, price, route}) {
		const visibility = React.useContext(VisibilityContext);
		if (airline_name.length == 1 || airline_name[0][0] == 'A')
			return (
				<div className="card">
					<div>Airline: {airline_name[0]} </div>
					<div>Route: {route[0]} </div>
					<div className="airline_thumbnail">
						<img src={airline_logos[airline_code[0]]} />
					</div>
					<div>Price: ${price} </div>
				</div>
			);
		if (airline_name.length == 2)
			return (
				<div className="card_wide">
					<div>Airlines: {airline_name[0]} and {airline_name[1]}</div>
					<div>Route: {route[0]}, {route[1]}</div>
					<div className="airline_thumbnail">
						<img src={airline_logos[airline_code[0]]} />
						<img src={airline_logos[airline_code[1]]} />
					</div>
					<div >Price: ${price} </div>
				</div>
			);
		else
			console.log("Error, invalid number of airlines");
	}

	function LeftArrow() {
		const { isFirstItemVisible, scrollPrev } =
			  React.useContext(VisibilityContext);
		return (
			<button className="button_plane" disabled={isFirstItemVisible} onClick={() => scrollPrev()}>
				<img src={plane_left} alt="plane_left"/> 				
			</button>
		);
	}

	function RightArrow() {
		const { isLastItemVisible, scrollNext } = React.useContext(VisibilityContext);
		return (
			<button className="button_plane" disabled={isLastItemVisible} onClick={() => scrollNext()}>
				<img src={plane_right} alt="plane_right"/> 
			</button>
		);
	}
}
