# import re
# from flask import request, jsonify
# from routes import barbershop_bp
# from utils import fetch_barbershops_from_google
# import openai

# openai.api_key = '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'

# @barbershop_bp.route('/api/barbershops', methods=['GET'])
# def get_barbershops():
#     lat = request.args.get('lat')
#     lng = request.args.get('lng')
#     radius = request.args.get('radius')
#     query = request.args.get('query')

#     print(f"Received query: {query}, lat: {lat}, lng: {lng}, radius: {radius}")

#     if query:
#         try:
#             response = openai.Completion.create(
#                 engine="text-davinci-003",
#                 prompt=f"Extract latitude, longitude, and radius from the query: '{query}'",
#                 max_tokens=50
#             )
#             response_text = response.choices[0].text.strip()
#             print(f"LLM Response: {response_text}")

#             lat_lng_radius_match = re.search(r'lat:\s*([\d.-]+),\s*lng:\s*([\d.-]+),\s*radius:\s*(\d+)', response_text)
#             if lat_lng_radius_match:
#                 lat, lng, radius = lat_lng_radius_match.groups()
#                 lat, lng, radius = float(lat), float(lng), float(radius)
#             else:
#                 print("Failed to extract parameters from query")
#                 return jsonify({'error': 'Failed to extract parameters from query'}), 500

#         except Exception as e:
#             print(f"Error calling LLM: {e}")
#             return jsonify({'error': 'Failed to process query'}), 500

#     if lat is None or lng is None or radius is None:
#         return jsonify({'error': 'Missing parameters'}), 400

#     try:
#         lat = float(lat)
#         lng = float(lng)
#         radius = float(radius)
#         print(f"Received parameters - lat: {lat}, lng: {lng}, radius: {radius}")
#     except ValueError as e:
#         print(f"Error in parameters: {e}")
#         return jsonify({'error': 'Invalid parameters'}), 400

#     try:
#         shops = fetch_barbershops_from_google(lat, lng, radius)
#         print(f"Fetched barbershops: {shops}")
#     except Exception as e:
#         print(f"Error fetching barbershops: {e}")
#         return jsonify({'error': 'Failed to fetch barbershops'}), 500

#     return jsonify(shops)


# import re
# from flask import request, jsonify
# from routes import barbershop_bp
# from utils import fetch_barbershops_from_google
# from openai import OpenAI

# client = OpenAI(api_key='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')


# @barbershop_bp.route('/api/barbershops', methods=['GET'])
# def get_barbershops():
#     lat = request.args.get('lat')
#     lng = request.args.get('lng')
#     radius = request.args.get('radius')
#     query = request.args.get('query')

#     print(f"Received query: {query}, lat: {lat}, lng: {lng}, radius: {radius}")

#     if query:
#         try:
#             response = client.completions.create(model="text-davinci-003",
#             prompt=f"Extract latitude, longitude, and radius from the query: '{query}'",
#             max_tokens=50)
#             response_text = response.choices[0].text.strip()
#             print(f"LLM Response: {response_text}")

#             lat_lng_radius_match = re.search(r'lat:\s*([\d.-]+),\s*lng:\s*([\d.-]+),\s*radius:\s*(\d+)', response_text)
#             if lat_lng_radius_match:
#                 lat, lng, radius = lat_lng_radius_match.groups()
#                 lat, lng, radius = float(lat), float(lng), float(radius)
#             else:
#                 print("Failed to extract parameters from query")
#                 return jsonify({'error': 'Failed to extract parameters from query'}), 500

#         except Exception as e:
#             print(f"Error calling LLM: {e}")
#             return jsonify({'error': 'Failed to process query'}), 500

#     if lat is None or lng is None or radius is None:
#         return jsonify({'error': 'Missing parameters'}), 400

#     try:
#         lat = float(lat)
#         lng = float(lng)
#         radius = float(radius)
#         print(f"Received parameters - lat: {lat}, lng: {lng}, radius: {radius}")
#     except ValueError as e:
#         print(f"Error in parameters: {e}")
#         return jsonify({'error': 'Invalid parameters'}), 400

#     try:
#         shops = fetch_barbershops_from_google(lat, lng, radius)
#         print(f"Fetched barbershops: {shops}")
#     except Exception as e:
#         print(f"Error fetching barbershops: {e}")
#         return jsonify({'error': 'Failed to fetch barbershops'}), 500

#     return jsonify(shops)

# import re
# from flask import request, jsonify
# from routes import barbershop_bp
# from utils import fetch_barbershops_from_google
# from openai import OpenAI

# client = OpenAI(api_key='sk-jmrfl8ZiXBlIv2UCe8hn4cUKPBsE0fMbwyCJTdkjorT3BlbkFJJ1gJ33ofbl8mAxzFgtwZsFctII6WfKx7KH9pdTPCcA')


# @barbershop_bp.route('/api/barbershops', methods=['GET'])
# def get_barbershops():
#     lat = request.args.get('lat')
#     lng = request.args.get('lng')
#     radius = request.args.get('radius')
#     query = request.args.get('query')

#     print(f"Received query: {query}, lat: {lat}, lng: {lng}, radius: {radius}")

#     if query:
#         try:
#             response = client.chat.completions.create(model="gpt-3.5-turbo",
#             messages=[
#                 {"role": "system", "content": "You are a helpful assistant."},
#                 {"role": "user", "content": f"Extract latitude, longitude, and radius from the query: '{query}'"}
#             ],
#             max_tokens=50)
#             response_text = response.choices[0].message.content.strip()
#             print(f"LLM Response: {response_text}")

#             lat_lng_radius_match = re.search(r'lat:\s*([\d.-]+),\s*lng:\s*([\d.-]+),\s*radius:\s*(\d+)', response_text)
#             if lat_lng_radius_match:
#                 lat, lng, radius = lat_lng_radius_match.groups()
#                 lat, lng, radius = float(lat), float(lng), float(radius)
#             else:
#                 print("Failed to extract parameters from query")
#                 return jsonify({'error': 'Failed to extract parameters from query'}), 500

#         except Exception as e:
#             print(f"Error calling LLM: {e}")
#             return jsonify({'error': 'Failed to process query'}), 500

#     if lat is None or lng is None or radius is None:
#         return jsonify({'error': 'Missing parameters'}), 400

#     try:
#         lat = float(lat)
#         lng = float(lng)
#         radius = float(radius)
#         print(f"Received parameters - lat: {lat}, lng: {lng}, radius: {radius}")
#     except ValueError as e:
#         print(f"Error in parameters: {e}")
#         return jsonify({'error': 'Invalid parameters'}), 400

#     try:
#         shops = fetch_barbershops_from_google(lat, lng, radius)
#         print(f"Fetched barbershops: {shops}")
#     except Exception as e:
#         print(f"Error fetching barbershops: {e}")
#         return jsonify({'error': 'Failed to fetch barbershops'}), 500

#     return jsonify(shops)

# import openai
# import re
# from flask import request, jsonify
# from routes import barbershop_bp
# from utils import fetch_barbershops_from_google

# client = OpenAI(api_key='sk--ArHUutge75FvrCmb7OGLkflyG5u-2_t_Oi9D4nIRqT3BlbkFJ5nKF_1jiAHwH1vcuwZBYgshfsPdsfoWhsT7rvW-Q8A')

# @barbershop_bp.route('/api/barbershops', methods=['GET'])
# def get_barbershops():
#     lat = request.args.get('lat')
#     lng = request.args.get('lng')
#     radius = request.args.get('radius')
#     query = request.args.get('query')

#     if query:
#         try:
#             response = openai.ChatCompletion.create(
#                 model="gpt-3.5-turbo",
#                 messages=[
#                     {"role": "system", "content": "You are a helpful assistant."},
#                     {"role": "user", "content": f"Extract latitude, longitude, and radius from the query: '{query}'"}
#                 ],
#                 max_tokens=50
#             )
#             response_text = response.choices[0].message['content'].strip()
#             print(f"LLM Response: {response_text}")

#             # Use a more flexible regex pattern based on actual response
#             lat_lng_radius_match = re.search(r'lat:\s*([\d.-]+),\s*lng:\s*([\d.-]+),\s*radius:\s*(\d+)', response_text)
#             if lat_lng_radius_match:
#                 lat, lng, radius = lat_lng_radius_match.groups()
#                 lat, lng, radius = float(lat), float(lng), float(radius)
#             else:
#                 return jsonify({'error': 'Failed to extract parameters from query'}), 500

#         except Exception as e:
#             print(f"Error calling LLM: {e}")
#             return jsonify({'error': 'Failed to process query'}), 500

#     if lat is None or lng is None or radius is None:
#         return jsonify({'error': 'Missing lat, lng, or radius parameters'}), 400

#     try:
#         lat = float(lat)
#         lng = float(lng)
#         radius = float(radius)
#     except ValueError as e:
#         return jsonify({'error': f'Invalid parameters: {e}'}), 400

#     try:
#         shops = fetch_barbershops_from_google(lat, lng, radius)
#         return jsonify(shops)
#     except Exception as e:
#         return jsonify({'error': f'Failed to fetch barbershops: {e}'}), 500

# from flask import request, jsonify
# from routes import barbershop_bp
# from utils import fetch_barbershops_from_google

# @barbershop_bp.route('/api/barbershops', methods=['GET'])
# def get_barbershops():
#     lat = request.args.get('lat')
#     lng = request.args.get('lng')
#     radius = request.args.get('radius')

#     if lat is None or lng is None or radius is None:
#         return jsonify({'error': 'Missing parameters'}), 400

#     try:
#         lat = float(lat)
#         lng = float(lng)
#         radius = float(radius)
#     except ValueError:
#         return jsonify({'error': 'Invalid parameters'}), 400

#     shops = fetch_barbershops_from_google(lat, lng, radius)
#     return jsonify(shops)

import requests
import redis

API_KEY = 'YOUR_GOOGLE_PLACES_API_KEY'
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
        'longitude': place['geometry']['location']['lng'],
        'distance': calculate_distance(lat, lng, place['geometry']['location']['lat'], place['geometry']['location']['lng'])  # Distance in meters
    } for place in data.get('results', [])]

    redis_client.set(cache_key, str(shops), ex=3600)  # Cache for 1 hour
    return shops

def calculate_distance(lat1, lng1, lat2, lng2):
    # Simple distance calculation (replace with Haversine formula for more accurate results)
    return ((lat1 - lat2) ** 2 + (lng1 - lng2) ** 2) ** 0.5 * 111000
