from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
from extensions import db

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Allow CORS requests from localhost:3000
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

    db.init_app(app)

    from models import City, Barbershop
    from routes.barbershop_routes import barbershop_bp
    from routes.city_routes import city_bp
    from routes.reviews_routes import barbershop_bp 

    app.register_blueprint(barbershop_bp)
    app.register_blueprint(city_bp)
    #app.register_blueprint(barbershop_bp)

    with app.app_context():
        db.create_all()

    return app
