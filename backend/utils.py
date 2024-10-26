import requests
import redis
from dotenv import load_dotenv
import os
import json

load_dotenv()
API_KEY = os.getenv("API_KEY")
redis_client = redis.Redis(host='localhost', port=6379, db=0)

def fetch_barbershops_from_google(lat, lng, radius):
    try:
        # Validate API_KEY
        if not API_KEY:
            raise ValueError("API_KEY is not set.")

        cache_key = f"{lat}:{lng}:{radius}"
        cached_result = redis_client.get(cache_key)
        
        if cached_result:
            return json.loads(cached_result)
        
        url = (
            f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?"
            f"location={lat},{lng}&radius={radius}&type=hair_care&key={API_KEY}"
        )
        
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for HTTP errors
        
        data = response.json()
        print(f"API Response: {data}")  # Log the entire response
        
        shops = [{
            'name': place.get('name'),
            'address': place.get('vicinity'),
            'latitude': place['geometry']['location']['lat'],
            'longitude': place['geometry']['location']['lng']
        } for place in data.get('results', [])]
        
        redis_client.set(cache_key, json.dumps(shops), ex=3600)  # Cache for 1 hour
        
        return shops

    except requests.RequestException as e:
        print(f"Request failed: {e}")
        return []
    except (redis.RedisError, ValueError) as e:
        print(f"Redis error: {e}")
        return []
