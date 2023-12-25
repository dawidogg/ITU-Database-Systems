import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { Helmet } from 'react-helmet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';
import airplaneIconUrl from '../images/airplane.png'; // Adjust the path based on your file structure

const TITLE = 'Map';

function Map(props) {
  const [marker1, setMarker1] = useState([0, 0]);
  const [marker2, setMarker2] = useState([0, 0]);
  const [activeMarker, setActiveMarker] = useState(0);
  const markerRef1 = useRef(null);
  const markerRef2 = useRef(null);
  const [data1, setData1] = useState("");
  const [data2, setData2] = useState("");
  const [polylineCoords, setPolylineCoords] = useState([]);
  const [planePosition, setPlanePosition] = useState([0, 0]);

  const LocationFinderDummy = () => {
    const map = useMapEvents({
      click(e) {
        let data = {};
        if (activeMarker === 0) {
          setMarker1([e.latlng.lat, e.latlng.lng]);
        } else {
          setMarker2([e.latlng.lat, e.latlng.lng]);
        }
        setActiveMarker(1 - activeMarker);
      },
    });
    return null;
  };

  useEffect(() => {
    const data = { position: { lat: marker1[0], lng: marker1[1] } };
    fetch('http://localhost:8080/closest_airport', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(response => response.json()).then(data => {
      setData1(data);
      props.onMarker1(data["id"]);
      const marker = markerRef1.current;
      if (marker) {
        marker.openPopup();
      }
    });
  }, [marker1]);

  useEffect(() => {
    const data = { position: { lat: marker2[0], lng: marker2[1] } };
    fetch('http://localhost:8080/closest_airport', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(response => response.json()).then(data => {
      setData2(data);
      props.onMarker2(data["id"]);
      const marker = markerRef2.current;
      if (marker) {
        marker.openPopup();
      }
    });
  }, [marker2]);

  useEffect(() => {
    setPolylineCoords([marker1, marker2]);
  }, [marker1, marker2]);

  useEffect(() => {
    let currentSegment = 0;
    const updatePlanePosition = () => {
      if (currentSegment < polylineCoords.length - 1) {
        const [startLat, startLng] = polylineCoords[currentSegment];
        const [endLat, endLng] = polylineCoords[currentSegment + 1];

        const progress = (Date.now() - startTime) / animationDuration;
        const currentLat = startLat + progress * (endLat - startLat);
        const currentLng = startLng + progress * (endLng - startLng);

        setPlanePosition([currentLat, currentLng]);

        // Check if the plane has reached marker2
        if (
          currentSegment === polylineCoords.length - 2 &&
          progress >= 1.0
        ) {
          clearInterval(animationInterval);
        }
      } else {
        // Animation completed, reset plane position
        setPlanePosition([0, 0]);
        clearInterval(animationInterval);
      }
    };

    const startTime = Date.now();
    const animationDuration = 5000; // Adjust this value for the desired animation speed

    const animationInterval = setInterval(updatePlanePosition, 50);

    return () => {
      clearInterval(animationInterval);
    };
  }, [polylineCoords]);

  const customIcon = new Icon({
    iconUrl: require("../images/placeholder.png"),
    iconSize: [38, 38]
  });

  const customPlaneIcon = new Icon({
    iconUrl: airplaneIconUrl,
    iconSize: [20, 20], // Adjust the size as needed
  });

  return (
    <main style={{ display: 'flex', flexDirection: 'row' }}>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <div style={{ flex: '2' }}>
        <MapContainer
          center={[0, 0]}
          zoom={2}
          style={{ height: '500px', width: '100%' }}>
          <LocationFinderDummy />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker icon={customIcon} position={marker1} ref={markerRef1}>
            <Popup>{data1["name"]}</Popup>
          </Marker>
          <Marker icon={customIcon} position={marker2} ref={markerRef2}>
            <Popup>{data2["name"]}</Popup>
          </Marker>
          <Marker icon={customPlaneIcon} position={planePosition}>
            <Popup>Plane</Popup>
          </Marker>
          {polylineCoords.length === 2 && (
            <Polyline pathOptions={{ color: 'blue' }} positions={polylineCoords} />
          )}
        </MapContainer>
      </div>
      <div style={{ flex: '1', padding: '20px' }}>
        <div>
          <h2>Your Travel Starts..</h2>
          <h2>From: {data1 && data1["name"]}</h2>
          <h2>To: {data2 && data2["name"]}</h2>
        </div>
        <h3><i>Navigate to the next page to calculate the expenses.</i></h3>
      </div>
    </main>
  );
}

export default Map;
