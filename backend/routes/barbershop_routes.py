from flask import request, jsonify
from routes import barbershop_bp
from utils import fetch_barbershops_from_google

@barbershop_bp.route('/api/barbershops', methods=['GET'])
def get_barbershops():
    lat = request.args.get('lat')
    lng = request.args.get('lng')
    radius = request.args.get('radius')

    if lat is None or lng is None or radius is None:
        return jsonify({'error': 'Missing parameters'}), 400

    try:
        lat = float(lat)
        lng = float(lng)
        radius = float(radius)
        print(f"Received parameters - lat: {lat}, lng: {lng}, radius: {radius}")
    except ValueError:
        return jsonify({'error': 'Invalid parameters'}), 400

    shops = fetch_barbershops_from_google(lat, lng, radius)
    print(f"Fetched barbershops: {shops}")
    return jsonify(shops)
