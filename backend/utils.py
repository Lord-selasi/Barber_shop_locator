import requests
import redis
from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = os.getenv("API_KEY")


redis_client = redis.Redis(host='localhost', port=6379, db=0)

def fetch_barbershops_from_google(lat, lng, radius):
    cache_key = f"{lat}:{lng}:{radius}"
    cached_result = redis_client.get(cache_key)
    if cached_result:
        return eval(cached_result)

    url = (
        f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?"
        f"location={lat},{lng}&radius={radius}&type=hair_care&key={API_KEY}"
    )
    response = requests.get(url)
    data = response.json()
    shops = [{
        'name': place.get('name'),
        'address': place.get('vicinity'),
        'latitude': place['geometry']['location']['lat'],
        'longitude': place['geometry']['location']['lng']
    } for place in data.get('results', [])]

    redis_client.set(cache_key, str(shops), ex=3600)  # Cache for 1 hour
    return shops
