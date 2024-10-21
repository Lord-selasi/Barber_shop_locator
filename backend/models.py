from extensions import db
from geoalchemy2 import Geometry

class City(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    location = db.Column(Geometry('POINT'), nullable=False)

class Barbershop(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Corrected typo here
    name = db.Column(db.String(80), nullable=False)
    address = db.Column(db.String(200))
    city_id = db.Column(db.Integer, db.ForeignKey('city.id'))
    phone = db.Column(db.String(20))
    website = db.Column(db.String(100))
    location = db.Column(Geometry('POINT'), nullable=False)

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    barbershop_id = db.Column(db.Integer, db.ForeignKey('barbershop.id'))
    rating = db.Column(db.Integer, nullable=False)  # Added nullable=False for rating
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

class BarberReview(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    barbershop_id = db.Column(db.Integer, db.ForeignKey('barbershop.id'))
    rating = db.Column(db.Integer, nullable=False)  # Added nullable=False for rating
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
