from flask import request, jsonify
from models import City  # Import models directly
from extensions import db
from routes import city_bp

@city_bp.route('/api/cities', methods=['POST'])
def add_city():
    data = request.get_json()
    city = City(name=data['name'], location='POINT({} {})'.format(data['longitude'], data['latitude']))
    db.session.add(city)
    db.session.commit()
    return jsonify({'message': 'City added successfully'})

@city_bp.route('/api/cities/<city_name>', methods=['GET'])
def find_city(city_name):
    city = City.query.filter_by(name=city_name).first()
    if not city:
        return jsonify({'message': 'City not found'}), 404
    return jsonify({
        'name': city.name,
        'latitude': city.location.y,
        'longitude': city.location.x
    })
