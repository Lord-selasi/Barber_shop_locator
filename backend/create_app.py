from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
import redis
from extensions import db

load_dotenv()
# Initialize Redis
redis_client = redis.StrictRedis(
    host='localhost',  
    port=6379,         
    db=0,              
    decode_responses=True  
)

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Allow CORS requests from localhost:3000
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

    db.init_app(app)

    from models import City, Barbershop, Review
    from routes.barbershop_routes import barbershop_bp
    from routes.city_routes import city_bp
    from routes.reviews_routes import reviews_bp 

    app.register_blueprint(barbershop_bp)
    app.register_blueprint(city_bp)
    app.register_blueprint(reviews_bp)
   

    with app.app_context():
        db.create_all()

    return app
