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
	let airlines = [];

	const [plane_offers, set_plane_offers] = useState([]);
	const [clicked_card, updateClickedCard] = useState(-1);
	const [plane_cost, set_plane_cost] = useState(0);
	const [day_count, set_day_count] = useState(0);
	const [planes_loaded, set_planes_loaded] = useState(false);

	const fetch_plane_offers = async () => {
		set_planes_loaded(false);
		console.log("New plane offers fetching...");
		const response = await fetch('http://localhost:8080/plane_offers/'+props.origin+'/'+props.destination);
		// const response = await fetch('http://localhost:8080/plane_offers/'+344+'/'+1688); 
		const text = await response.text();
		set_plane_offers(JSON.parse(text));

		airlines = [];
		for (const offer of plane_offers)
			for (const code of offer[2])
				airlines.push(code)
		set_planes_loaded(true);
	}

	const saveHistory = (e) => {
		e.preventDefault();
		let data = [props.user_credentials, props.origin, props.destination, parseInt(day_count), parseInt(day_count)+parseInt(plane_cost)];
		fetch("http://localhost:8080/post_history", {
			method: 'POST',
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify(data),
		}).then(response => {
			return response.text();
		}).then(responseData => {
			console.log(responseData);
		});
	}

	const [where, setWhere] = useState("Loading...");

	const getWhere = async () => {
		const response1 = await fetch('http://localhost:8080/city_country/'+props.origin)
		const response2 = await fetch('http://localhost:8080/city_country/'+props.destination);
		const text1 = await response1.json();
		const text2 = await response2.json();
		setWhere(text1[0]["city"] + ", " + text1[0]["country"]  + " - " +  text2[0]["city"] + ", " + text2[0]["country"]);
	}
	
	useEffect(() => {
		getWhere();
		fetch_plane_offers();
	}, []);

	return (
		<main>
			<Helmet>
				<title> {TITLE} </title>
			</Helmet>
			<div className="calculator">
				<h1>Calculator</h1>
				<h2>{where}</h2>
				<label htmlFor="days">Number of days: </label>
				<input type="number" id="days" name="days" onChange={e =>
						   set_day_count((parseInt(e.target.value) >= 0)? e.target.value : 0)
					   } required/> 

				{planes_loaded?
				 <ScrollMenu className="scrollMenu" LeftArrow={LeftArrow} RightArrow={RightArrow}>
					 {plane_offers.map((item, index) => {
						 return (<Card
									 itemId={index} 
									 count={item[0]}
									 airline_name={item[1]}
									 airline_code={item[2]}
									 route={item[3]}
									 price={item[4]}
									 key={index}
								 />)
					 })}
				 </ScrollMenu>
				 : <div className="loading">Plane ticket offers are loading...</div>
				}
				<br />
				<p> Total: ${parseInt(plane_cost)+parseInt(day_count)}</p>
				<button onClick={saveHistory}>Save</button>
			</div>
		</main>
	);

	function Card({itemId, count, airline_name, airline_code, route, price}) {
		const visibility = React.useContext(VisibilityContext);
		const stops = route.subarray(1, -1);
		let card_class = "card_" + count + ((itemId === clicked_card) ? " clicked_card" : " card");
		return (
			<div className={card_class} onClick={() => {
					 updateClickedCard(itemId);
					 set_plane_cost(price);
				 }}>
				<div>Airline{(count == 1) ? '' : 's'}: {" "+airline_name} </div>
				<div>{(count == 1) ? 'Direct flight' : ('Stops at '+ stops)} </div>
				<div className="airline_thumbnail">
					{airline_code.map((obj, index) => {
						return (<img src={"./airline_logos/"+obj+".png"} />)
					})}
				</div>
				<div>Price: ${price} </div>
			</div>
		);
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

Array.prototype.subarray = function(start, end) {
    if (!end) { end = -1; } 
    return this.slice(start, this.length + 1 - (end * -1));
};
