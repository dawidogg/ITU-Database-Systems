import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { Helmet } from 'react-helmet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, divIcon, point } from "leaflet";

const TITLE = 'Map';

function Map(props) {
	const [marker1, setMarker1]  = useState([0, 0]);
	const [marker2, setMarker2]  = useState([0, 0]);
	const [activeMarker, setActiveMarker] = useState(0);

	const [data1, setData1] = useState("");
	const [data2, setData2] = useState("");

	const LocationFinderDummy = () => {
		const map = useMapEvents({
			click(e) {
				let data = {}; 
				console.log(e.latlng);
				if (activeMarker == 0) {
					setMarker1([e.latlng["lat"], e.latlng["lng"]]);
				} else {
					setMarker2([e.latlng["lat"], e.latlng["lng"]]);
				}
				setActiveMarker(1-activeMarker);
			},
		});
		return null;
	};
	
	useEffect(() => {
		const data = {position: { lat: marker1[0], lng: marker1[1] }};
		fetch('http://localhost:8080/closest_airport', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(data)
		}).then(response => response.json()).then(data => {
			console.log(data);
			setData1(data);
			props.onMarker1(data["id"]);
		});
	}, [marker1]);

	useEffect(() => {
		const data = {position: { lat: marker2[0], lng: marker2[1] }};
		fetch('http://localhost:8080/closest_airport', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(data)
		}).then(response => response.json()).then(data => {
			console.log(data);
			setData2(data);
			props.onMarker2(data["id"]);
		});
		props.onMarker2();
	}, [marker2]);

	const customIcon = new Icon({
		// iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
		iconUrl: require("../images/placeholder.png"),
		iconSize: [38, 38] // size of the icon
	});

	return (
		<main>
			<Helmet>
				<title> {TITLE} </title>
			</Helmet>
			<MapContainer
				center={[0, 0]}
				zoom={6}
				style={{ height: '500px', width: '100%' }}>
				<LocationFinderDummy />
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				/>
				<Marker icon={customIcon}
						position={marker1}>
					<Popup>{data1["name"]}</Popup>
				</Marker>
				<Marker icon={customIcon}
						position={marker2}>
					<Popup>{data2["name"]}</Popup>
				</Marker>
			</MapContainer>
			
		</main>
	);
}

export default Map;
