import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Tooltip,
} from "react-leaflet";
import "bootstrap/dist/css/bootstrap.min.css"; // Importing Bootstrap for styling
import "leaflet/dist/leaflet.css"; // Importing Leaflet CSS for the map

const SearchBarbershops = () => {
  const [position, setPosition] = useState(null); // User's location
  const [radius, setRadius] = useState(""); // Search radius
  const [barbershops, setBarbershops] = useState([]); // List of barbershops
  const [selectedBarbershop, setSelectedBarbershop] = useState(null); // Selected barbershop
  const [reviews, setReviews] = useState([]); // Reviews for the selected barbershop
  const [error, setError] = useState(null); // Error messages
  const [routePolyline, setRoutePolyline] = useState([]); // Route directions

  // useEffect to get the user's current location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  // Function to search for barbershops within the specified radius
  const handleSearch = () => {
    if (!radius) {
      setError("Please enter a radius");
      return;
    }

    const url = `http://127.0.0.1:5000/api/barbershops?lat=${position[0]}&lng=${position[1]}&radius=${radius}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setBarbershops([]);
        } else {
          setError(null);
          const updatedBarbershops = data.map((shop) => ({
            ...shop,
            distance: calculateDistance(
              position[0],
              position[1],
              shop.latitude,
              shop.longitude
            ),
          }));
          setBarbershops(
            updatedBarbershops.sort((a, b) => a.distance - b.distance)
          );
        }
      })
      .catch(() => setError("Failed to fetch barbershops"));
  };

  // Function to select a barbershop, fetch directions and reviews
  const handleSelectBarbershop = (shop) => {
    setSelectedBarbershop(shop);

    // Fetch directions
    const directionsUrl = `http://127.0.0.1:5000/api/directions?origin_lat=${position[0]}&origin_lng=${position[1]}&dest_lat=${shop.latitude}&dest_lng=${shop.longitude}`;
    fetch(directionsUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          const routePolyline = data.polyline.map((point) => [
            point[0],
            point[1],
          ]);
          setRoutePolyline(routePolyline);
        }
      })
      .catch(() => setError("Failed to fetch directions"));

    // Fetch reviews
    const reviewsUrl = `http://127.0.0.1:5000/api/barbershops/${shop.place_id}/reviews`;
    fetch(reviewsUrl)
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch(() => setError("Failed to fetch reviews"));
  };

  // Function to add a review
  const handleAddReview = (placeId, rating, comment) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        fetch(`http://127.0.0.1:5000/api/barbershops/${placeId}/reviews`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rating,
            comment,
            user_lat: userLat, // Send user's latitude
            user_lng: userLng, // Send user's longitude
          }),
        })
          .then((response) => response.json())
          .then((data) => alert(data.message)) // Alert success message
          .then(() =>
            fetch(`http://127.0.0.1:5000/api/barbershops/${placeId}/reviews`)
          )
          .then((response) => response.json())
          .then((updatedReviews) => setReviews(updatedReviews)) // Update reviews after submission
          .catch(() => alert("Failed to add review"));
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Function to calculate distance between two geographic points
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  };

  // Function to render the polyline on the map if a route is available
  const renderDirections = () => {
    if (!routePolyline || routePolyline.length === 0) return null;

    return (
      <Polyline positions={routePolyline} color="blue">
        <Tooltip sticky>Route to barbershop</Tooltip>
      </Polyline>
    );
  };

  return (
    <div className="container text-center mt-4">
      <div className="d-flex justify-content-between mb-3 align-items-center">
        <h2
          className="text-primary fw-bold"
          style={{
            fontSize: "2rem",
            textShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
            letterSpacing: "1px",
            background: "linear-gradient(45deg, #007bff, #6610f2)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Hey! Are You Ready For Your Barbershops Search?
        </h2>
        <Link to="/" className="btn btn-secondary">
          Home
        </Link>
      </div>
      <input
        type="number"
        value={radius}
        onChange={(e) => setRadius(e.target.value)}
        placeholder="Enter search radius for nearby barbershops (meters)"
        className="form-control mt-2 mb-3"
        style={{ maxWidth: "300px", margin: "0 auto" }}
      />
      <button onClick={handleSearch} className="btn btn-success mb-3">
        Search
      </button>
      {error && <p className="text-danger">{error}</p>}
      <MapContainer
        center={position || [45.550288, -94.1555175]}
        zoom={13}
        style={{ height: "50vh", width: "100%" }}
        whenReady={(map) => position && map.target.setView(position, 13)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {barbershops.map((shop, idx) => (
          <Marker key={idx} position={[shop.latitude, shop.longitude]}>
            <Popup>
              <h4>{shop.name}</h4>
              <p>{shop.address}</p>
              <p>{shop.distance} meters away</p>
              <ul>
                {reviews.length > 0 ? (
                  reviews.map((review, idx) => (
                    <li key={idx}>
                      {review.rating} stars: {review.comment}
                    </li>
                  ))
                ) : (
                  <p>No reviews available for this barbershop.</p>
                )}
              </ul>

              {/* Review form */}
              <div className="mt-3">
                <h5>Add a Review:</h5>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const rating = parseInt(e.target.elements.rating.value, 10);
                    const comment = e.target.elements.comment.value;
                    handleAddReview(shop.place_id, rating, comment);
                  }}
                >
                  <div className="mb-3">
                    <label htmlFor="rating">Rating:</label>
                    <select id="rating" name="rating" className="form-control">
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="comment">Comment:</label>
                    <textarea
                      id="comment"
                      name="comment"
                      className="form-control"
                      rows="3"
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Submit Review
                  </button>
                </form>
              </div>

              <button
                onClick={() => handleSelectBarbershop(shop)}
                className="btn btn-sm btn-info mt-2"
              >
                Get Directions
              </button>
            </Popup>
          </Marker>
        ))}
        {position && (
          <Marker position={position}>
            <Popup>My Location</Popup>
          </Marker>
        )}
        {renderDirections()}
      </MapContainer>

      <div className="mt-4">
        <h3>Barbershops:</h3>
        <ul className="list-group">
          {barbershops.map((shop, idx) => (
            <li
              key={idx}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{shop.name}</strong>
                <p>{shop.address}</p>
                <p>{shop.distance} meters away</p>
              </div>
              <button
                onClick={() => handleSelectBarbershop(shop)}
                className="btn btn-sm btn-primary"
              >
                Show on Map
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchBarbershops;
