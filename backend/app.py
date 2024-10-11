from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from geoalchemy2 import Geometry, functions
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
db = SQLAlchemy(app)

class City(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    location = db.Column(Geometry('POINT'), nullable=False)

class Barbershop(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    location = db.Column(Geometry('POINT'), nullable=False)

@app.route('/api/barbershops', methods=['GET'])
def get_barbershops():
    lat = float(request.args.get('lat'))
    lng = float(request.args.get('lng'))
    radius = float(request.args.get('radius'))
    shops = Barbershop.query.filter(
        functions.ST_DWithin(
            Barbershop.location,
            'POINT({} {})'.format(lng, lat),
            radius
        )
    ).all()
    return jsonify([{'name': shop.name, 'latitude': shop.location.y, 'longitude': shop.location.x} for shop in shops])

@app.route('/api/cities', methods=['POST'])
def add_city():
    data = request.get_json()
    city = City(name=data['name'], location='POINT({} {})'.format(data['longitude'], data['latitude']))
    db.session.add(city)
    db.session.commit()
    return jsonify({'message': 'City added successfully'})

if __name__ == '__main__':
    app.run(debug=True)
