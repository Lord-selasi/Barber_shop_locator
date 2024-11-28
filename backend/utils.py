import requests
import redis
from dotenv import load_dotenv
import os
import json

load_dotenv()
API_KEY = os.getenv("API_KEY")
redis_client = redis.Redis(host='localhost', port=6379, db=0)

def fetch_barbershops_from_google(lat, lng, radius):
    cache_key = f"{lat}:{lng}:{radius}"
    cached_result = redis_client.get(cache_key)
    
    if cached_result:
        return json.loads(cached_result)
    
    url = (
        f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?"
        f"location={lat},{lng}&radius={radius}&type=hair_care&key={API_KEY}"
    )
    
    response = requests.get(url)
    response.raise_for_status()
    data = response.json()
    
    shops = [{
        
        'name': place.get('name'),
        'address': place.get('vicinity'),
        'latitude': place['geometry']['location']['lat'],
        'longitude': place['geometry']['location']['lng'],
        'place_id': place.get('place_id')
         
    } for place in data.get('results', [])]
    
    redis_client.set(cache_key, json.dumps(shops), ex=3600)
    return shops

def fetch_directions_from_google(origin_lat, origin_lng, dest_lat, dest_lng):
    url = (
        f"https://maps.googleapis.com/maps/api/directions/json?"
        f"origin={origin_lat},{origin_lng}&destination={dest_lat},{dest_lng}&key={API_KEY}&mode=driving"
    )
    
    response = requests.get(url)
    response.raise_for_status()
    directions_data = response.json()
    
    if directions_data['status'] != 'OK':
        return None

    steps = directions_data['routes'][0]['legs'][0]['steps']
    polyline_points = [
        (step['start_location']['lat'], step['start_location']['lng'])
        for step in steps
    ]
    polyline_points.append((steps[-1]['end_location']['lat'], steps[-1]['end_location']['lng']))
    
    return polyline_points


