from flask import request, jsonify
from models import Review, Barbershop
from extensions import db
from flask import Blueprint

reviews_bp = Blueprint("reviews", __name__)

@reviews_bp.route('/api/barbershops/<place_id>/reviews', methods=['POST'])
def add_review(place_id):
    print(f"Received request for place_id: {place_id}")  # Debugging log
    data = request.get_json()
    rating = data.get('rating')
    comment = data.get('comment')
    user_lat = data.get('user_lat')
    user_lng = data.get('user_lng')
    barbershop_name = data.get('barbershop_name')  # Get barbershop name from frontend
    barbershop_address = data.get('barbershop_address')  # Get address from frontend

    if not all([rating, comment, user_lat, user_lng, barbershop_name, barbershop_address]):
        return jsonify({'error': 'All fields are required'}), 400

    if not (1 <= rating <= 5):
        return jsonify({'error': 'Rating must be between 1 and 5'}), 400

    # Check if the barbershop exists in the database
    barbershop = Barbershop.query.filter_by(place_id=place_id).first()
    if not barbershop:
        # If the barbershop doesn't exist, create it
        print(f"Barbershop with place_id {place_id} not found. Adding to database.")
        barbershop = Barbershop(
            place_id=place_id,
            name=barbershop_name,
            address=barbershop_address,
        )
        db.session.add(barbershop)
        db.session.commit()

    # Add the review
    review = Review(
        place_id=place_id,
        rating=rating,
        comment=comment,
        user_lat=user_lat,
        user_lng=user_lng
    )
    db.session.add(review)
    db.session.commit()

    print(f"Review added successfully for barbershop with place_id {place_id}")
    return jsonify({'message': 'Review added successfully'})

@reviews_bp.route('/api/barbershops/<place_id>/reviews', methods=['GET'])
def get_reviews(place_id):
    print(f"Fetching reviews for place_id: {place_id}")  # Debugging log

    reviews = Review.query.filter_by(place_id=place_id).all()
    if not reviews:
        print(f"No reviews found for barbershop with place_id {place_id}")
        return jsonify([]), 200  # Return an empty list instead of a message

    return jsonify([{
        'rating': review.rating,
        'comment': review.comment,
        'created_at': review.created_at
    } for review in reviews])



