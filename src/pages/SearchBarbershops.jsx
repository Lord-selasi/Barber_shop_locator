import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet.heat";

const SearchBarbershops = () => {
  // State management
  const [position, setPosition] = useState(null); // User's current location
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [radius, setRadius] = useState(""); // Search radius input
  const [barbershops, setBarbershops] = useState([]); // List of barbershops
  const [selectedBarbershop, setSelectedBarbershop] = useState(null); // Selected barbershop for reviews
  const [reviews, setReviews] = useState([]); // Reviews for the selected barbershop
  const [error, setError] = useState(null); // Error messages
  const [routePolyline, setRoutePolyline] = useState([]); // Directions polyline
  const [isHeatmapEnabled, setIsHeatmapEnabled] = useState(false); // Heatmap toggle
  const [heatmapLayer, setHeatmapLayer] = useState(null); // Heatmap layer

  // Fetch user's geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          setIsLoading(false);
        },
        () => {
          setError(
            "Unable to retrieve location. Please enable location access."
          );
          setIsLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }
  }, []);

  // Search for barbershops
  const handleSearch = () => {
    if (!radius || !position) {
      alert("Please enter a radius and wait for geolocation.");
      return;
    }

    fetch(
      `http://127.0.0.1:5000/api/barbershops?lat=${position[0]}&lng=${position[1]}&radius=${radius}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
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
          createHeatmapLayer(updatedBarbershops); // Pass data with review_count
        }
      })
      .catch(() => setError("Failed to fetch barbershops."));
  };

  // Create heatmap layer based on review count
  const createHeatmapLayer = (data) => {
    const heatmapPoints = data.map((shop) => [
      shop.latitude,
      shop.longitude,
      shop.review_count || 1, // Use review_count as intensity, default to 1
    ]);
    const layer = L.heatLayer(heatmapPoints, {
      radius: 30,
      blur: 15,
      maxZoom: 17,
      gradient: {
        0.1: "blue",
        0.3: "lime",
        0.6: "yellow",
        0.9: "red",
      },
    });
    setHeatmapLayer(layer);
  };

  // Toggle heatmap visibility
  const toggleHeatmap = () => {
    setIsHeatmapEnabled(!isHeatmapEnabled);
  };

  // Control heatmap on the map
  const HeatmapControl = () => {
    const map = useMap();
    useEffect(() => {
      if (isHeatmapEnabled && heatmapLayer) {
        map.addLayer(heatmapLayer);
      } else if (heatmapLayer) {
        map.removeLayer(heatmapLayer);
      }
    }, [isHeatmapEnabled, heatmapLayer, map]);

    return null;
  };

  // Fetch reviews for a barbershop
  const handleFetchReviews = (placeId) => {
    fetch(`http://127.0.0.1:5000/api/barbershops/${placeId}/reviews`)
      .then((response) => response.json())
      .then((data) => {
        setReviews(data);
        setSelectedBarbershop(
          barbershops.find((shop) => shop.place_id === placeId)
        );
      })
      .catch(() => alert("Failed to fetch reviews."));
  };

  // Add a review
  const handleAddReview = (placeId, name, address, rating, comment) => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        fetch(`http://127.0.0.1:5000/api/barbershops/${placeId}/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rating,
            comment,
            user_lat: userLat,
            user_lng: userLng,
            barbershop_name: name,
            barbershop_address: address,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.error) {
              alert(`Failed to add review: ${data.error}`);
            } else {
              alert(data.message);
              handleFetchReviews(placeId);
            }
          })
          .catch(() => alert("Failed to add review."));
      },
      (error) => alert(`Geolocation error: ${error.message}`)
    );
  };

  // Get directions to a barbershop
  const handleGetDirections = (shop) => {
    fetch(
      `http://127.0.0.1:5000/api/directions?origin_lat=${position[0]}&origin_lng=${position[1]}&dest_lat=${shop.latitude}&dest_lng=${shop.longitude}`
    )
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
      .catch(() => alert("Failed to fetch directions."));
  };

  // Calculate distance between two points
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3;
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

  return (
    <div className="container text-center mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-primary fw-bold">Find Your Perfect Cut</h2>
        <Link to="/" className="btn btn-secondary">
          Home
        </Link>
      </div>
      {isLoading && <p>Loading your location...</p>}
      {!isLoading && (
        <>
          <input
            type="number"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            placeholder="Enter search radius (meters)"
            className="form-control mt-2 mb-3"
            style={{ maxWidth: "300px", margin: "0 auto" }}
          />
          <button onClick={handleSearch} className="btn btn-success mb-2">
            Search
          </button>
          <button onClick={toggleHeatmap} className="btn btn-info ms-2">
            {isHeatmapEnabled ? "Disable Heatmap" : "Enable Heatmap"}
          </button>
          <MapContainer
            center={position || [45.550288, -94.1555175]}
            zoom={13}
            style={{ height: "50vh", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <HeatmapControl />
            {barbershops.map((shop, idx) => (
              <Marker key={idx} position={[shop.latitude, shop.longitude]}>
                <Popup>
                  <h4>{shop.name}</h4>
                  <p>{shop.address}</p>
                  <button
                    onClick={() => handleFetchReviews(shop.place_id)}
                    className="btn btn-primary btn-sm"
                  >
                    View Reviews
                  </button>
                  <button
                    onClick={() => handleGetDirections(shop)}
                    className="btn btn-success btn-sm mt-2"
                  >
                    Get Directions
                  </button>
                </Popup>
              </Marker>
            ))}
            {routePolyline.length > 0 && (
              <Polyline positions={routePolyline} color="blue">
                <Tooltip sticky>Route to Barbershop</Tooltip>
              </Polyline>
            )}
          </MapContainer>
          <div className="row mt-4">
            <div className="col-md-6">
              <h3>Barbershops</h3>
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
                    <div>
                      <button
                        onClick={() => handleFetchReviews(shop.place_id)}
                        className="btn btn-primary btn-sm me-2"
                      >
                        View Reviews
                      </button>
                      <button
                        onClick={() => handleGetDirections(shop)}
                        className="btn btn-success btn-sm"
                      >
                        Get Directions
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-6">
              {selectedBarbershop && (
                <>
                  <h3>Reviews for {selectedBarbershop.name}</h3>
                  <ul className="list-group">
                    {reviews.length > 0 ? (
                      reviews.map((review, idx) => (
                        <li key={idx} className="list-group-item">
                          <strong>{review.rating} stars:</strong>{" "}
                          {review.comment}
                        </li>
                      ))
                    ) : (
                      <p>No reviews available.</p>
                    )}
                  </ul>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const rating = parseInt(e.target.rating.value, 10);
                      const comment = e.target.comment.value;
                      handleAddReview(
                        selectedBarbershop.place_id,
                        selectedBarbershop.name,
                        selectedBarbershop.address,
                        rating,
                        comment
                      );
                    }}
                  >
                    <div className="mb-3">
                      <label htmlFor="rating">Rating:</label>
                      <select
                        id="rating"
                        name="rating"
                        className="form-control"
                      >
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
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchBarbershops;
