import csv
from flask import Flask, render_template, request, jsonify
from math import radians, sin, cos, sqrt, atan2

app = Flask(__name__)

def read_airports_from_csv(file_path='airports.csv'):
    airports = []
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        next(reader)  # Skip header row
        for row in reader:
            # Convert latitude and longitude to floats
            row[6] = float(row[6])
            row[7] = float(row[7])
            
            # Append the airport data as a dictionary with keys for each column
            airport_data = {
                'name': row[1],  # Airport name is in the second column
                'lat': row[6],
                'lng': row[7],
            }
            airports.append(airport_data)

    return airports

# Your airport data
airports = read_airports_from_csv()

def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Radius of Earth in kilometers
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    distance = R * c
    return distance

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate-closest-airports', methods=['POST'])
def calculate_closest_airports():
    data = request.get_json()
    position1 = data['position1']
    position2 = data['position2']

    # Find closest airports
    closest_airport1 = min(airports, key=lambda x: haversine(position1['lat'], position1['lng'], x['lat'], x['lng']))
    closest_airport2 = min(airports, key=lambda x: haversine(position2['lat'], position2['lng'], x['lat'], x['lng']))

    return jsonify({
        'airport1': {'lat': closest_airport1['lat'], 'lng': closest_airport1['lng'], 'name': closest_airport1['name']},
        'airport2': {'lat': closest_airport2['lat'], 'lng': closest_airport2['lng'], 'name': closest_airport2['name']}
    })

if __name__ == '__main__':
    app.run(debug=True)
