from flask import request, jsonify
from routes import barbershop_bp
from utils import fetch_barbershops_from_google, fetch_directions_from_google

@barbershop_bp.route('/api/barbershops', methods=['GET'])
def get_barbershops():
    lat = request.args.get('lat')
    lng = request.args.get('lng')
    radius = request.args.get('radius')

    if not all([lat, lng, radius]):
        return jsonify({'error': 'Missing parameters'}), 400

    try:
        lat, lng, radius = map(float, [lat, lng, radius])
    except ValueError:
        return jsonify({'error': 'Invalid parameters'}), 400

    shops = fetch_barbershops_from_google(lat, lng, radius)
    return jsonify(shops)

@barbershop_bp.route('/api/directions', methods=['GET'])
def get_directions():
    origin_lat = request.args.get('origin_lat')
    origin_lng = request.args.get('origin_lng')
    dest_lat = request.args.get('dest_lat')
    dest_lng = request.args.get('dest_lng')

    if not all([origin_lat, origin_lng, dest_lat, dest_lng]):
        return jsonify({'error': 'Missing parameters'}), 400

    try:
        origin_lat = float(origin_lat)
        origin_lng = float(origin_lng)
        dest_lat = float(dest_lat)
        dest_lng = float(dest_lng)
    except ValueError:
        return jsonify({'error': 'Invalid parameters'}), 400

    polyline_points = fetch_directions_from_google(origin_lat, origin_lng, dest_lat, dest_lng)
    if polyline_points is None:
        return jsonify({'error': 'Failed to get directions'}), 500

    return jsonify({'polyline': polyline_points})
