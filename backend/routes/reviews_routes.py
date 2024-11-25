from flask import request, jsonify
from models import Review
from extensions import db
from routes import barbershop_bp

@barbershop_bp.route('/api/barbershops/<place_id>/reviews', methods=['POST'])
def add_review(place_id):
    data = request.get_json()
    rating = data.get('rating')
    comment = data.get('comment')
    user_lat = data.get('user_lat')
    user_lng = data.get('user_lng')

    if not (1 <= rating <= 5):
        return jsonify({'error': 'Rating must be between 1 and 5'}), 400

    review = Review(
        place_id=place_id,
        rating=rating,
        comment=comment,
        user_lat=user_lat,
        user_lng=user_lng
    )
    db.session.add(review)
    db.session.commit()

    return jsonify({'message': 'Review added successfully'})

@barbershop_bp.route('/api/barbershops/<place_id>/reviews', methods=['GET'])
def get_reviews(place_id):
    reviews = Review.query.filter_by(place_id=place_id).all()
    return jsonify([{
        'rating': review.rating,
        'comment': review.comment,
        'created_at': review.created_at
    } for review in reviews])
