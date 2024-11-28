from extensions import db
from geoalchemy2 import Geometry

class City(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    location = db.Column(Geometry('POINT'), nullable=False)

class Barbershop(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    address = db.Column(db.String(200))
    city_id = db.Column(db.Integer, db.ForeignKey('city.id'))
    phone = db.Column(db.String(20))
    website = db.Column(db.String(100))
    location = db.Column(Geometry('POINT'), nullable=False)
    place_id = db.Column(db.String(50), unique=True, nullable=False)  # Unique identifier for barbershops


class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    place_id = db.Column(db.String(50), db.ForeignKey('barbershop.place_id'), nullable=False)  # Reference to Barbershop
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text)
    user_lat = db.Column(db.Float, nullable=False)  # User's latitude
    user_lng = db.Column(db.Float, nullable=False)  # User's longitude
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
