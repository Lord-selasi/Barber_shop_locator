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
  // State variables for user location, search radius, fetched barbershops, selected barbershop, errors, and route polyline
  const [position, setPosition] = useState(null);
  const [radius, setRadius] = useState("");
  const [barbershops, setBarbershops] = useState([]);
  const [selectedBarbershop, setSelectedBarbershop] = useState(null);
  const [error, setError] = useState(null);
  const [routePolyline, setRoutePolyline] = useState([]);

  // useEffect hook to get the user's current location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]); // Set the user's position
        },
        (error) => {
          setError(error.message); // Set an error message if geolocation fails
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

    // Fetch barbershops from backend API
    const url = `http://127.0.0.1:5000/api/barbershops?lat=${position[0]}&lng=${position[1]}&radius=${radius}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setBarbershops([]);
        } else {
          setError(null);
          // Calculate distance for each shop and sort by distance
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
      .catch((err) => {
        setError("Failed to fetch barbershops"); // Error if fetch fails
        setBarbershops([]);
      });
  };

  // Function to select a barbershop and fetch route directions
  const handleSelectBarbershop = (shop) => {
    setSelectedBarbershop(shop);

    // Fetch directions from API
    const url = `http://127.0.0.1:5000/api/directions?origin_lat=${position[0]}&origin_lng=${position[1]}&dest_lat=${shop.latitude}&dest_lng=${shop.longitude}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          // Set route polyline using fetched coordinates
          const routePolyline = data.polyline.map((point) => [
            point[0],
            point[1],
          ]);
          setRoutePolyline(routePolyline);
        }
      })
      .catch((err) => {
        setError("Failed to fetch directions");
      });
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
    const d = R * c;
    return d.toFixed(2); // Return distance
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
              {shop.name} <br /> {shop.address}
              <br />
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
