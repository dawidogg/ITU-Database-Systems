document.addEventListener('DOMContentLoaded', function () {
    let map;
    let markers = [];
    let line;
    let airportMarkers = [];

    function initMap() {
        map = L.map('map').setView([0, 0], 2);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        map.on('click', (event) => {
            placeMarker(event.latlng);
        });
    }

    function placeMarker(location) {
        if (markers.length < 2) {
            const marker = L.marker(location).addTo(map);
            markers.push(marker);

            if (markers.length === 2) {
                calculateClosestAirports(markers[0].getLatLng(), markers[1].getLatLng());
            }
        } else {
            clearMarkers();
            const marker = L.marker(location).addTo(map);
            markers.push(marker);
        }
    }

    function clearMarkers() {
        for (const marker of markers) {
            map.removeLayer(marker);
        }
        markers = [];

        if (line) {
            map.removeLayer(line);
        }

        for (const airportMarker of airportMarkers) {
            map.removeLayer(airportMarker.marker);
            map.removeLayer(airportMarker.label);
        }
        airportMarkers = [];
    }

    function calculateClosestAirports(position1, position2) {
        const data = {
            position1: { lat: position1.lat, lng: position1.lng },
            position2: { lat: position2.lat, lng: position2.lng }
        };

        fetch('/calculate-closest-airports', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            drawLine(data.airport1, data.airport2);
            drawAirportMarkers([data.airport1, data.airport2]);
        });
    }

    function drawLine(airport1, airport2) {
        const latLngs = [
            [airport1.lat, airport1.lng],
            [airport2.lat, airport2.lng]
        ];

        if (line) {
            map.removeLayer(line);
        }

        line = L.polyline(latLngs, { color: 'red' }).addTo(map);
    }

    function drawAirportMarkers(airports) {
        for (const airport of airports) {
            const marker = L.marker([airport.lat, airport.lng], { icon: redIcon }).addTo(map);
            airportMarkers.push({ marker, label: null });
    
            const nameLabel = L.divIcon({
                className: 'airport-label',
                html: `<div>${airport.name}</div>`
            });
    
            const labelMarker = L.marker([airport.lat, airport.lng], { icon: nameLabel }).addTo(map);
            airportMarkers[airportMarkers.length - 1].label = labelMarker;
        }
    }
    

    const redIcon = L.divIcon({
        className: 'custom-icon',
        html: '<div style="background-color: red; width: 10px; height: 10px; border-radius: 50%;"></div>'
    });

    initMap();
});
