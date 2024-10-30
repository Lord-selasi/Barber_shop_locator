import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "bootstrap/dist/css/bootstrap.min.css";

const AddCity = () => {
  const [cityName, setCityName] = useState("");
  const [position, setPosition] = useState(null);
  const [message, setMessage] = useState("");

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        setPosition([e.latlng.lat, e.latlng.lng]);
        setMessage("");
      },
    });
    return null;
  };

  const handleAddCity = () => {
    if (!cityName || !position) {
      setMessage("Please enter a city name and select a position on the map.");
      return;
    }
    fetch("http://127.0.0.1:5000/api/cities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: cityName,
        latitude: position[0],
        longitude: position[1],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage("City added successfully!");
        setCityName("");
        setPosition(null);
      })
      .catch((err) => {
        console.error(err);
        setMessage("Error adding city.");
      });
  };

  return (
    <div className="container text-center mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
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
          Add New City
        </h2>
        <Link to="/" className="btn btn-secondary">
          Home
        </Link>
      </div>
      <input
        type="text"
        value={cityName}
        onChange={(e) => setCityName(e.target.value)}
        placeholder="Enter City Name"
        className="form-control mb-3"
        style={{ maxWidth: "300px", margin: "0 auto" }}
      />
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: "50vh", width: "100%", marginBottom: "10px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler />
        {position && <Marker position={position}></Marker>}
      </MapContainer>
      <button onClick={handleAddCity} className="btn btn-primary mb-3">
        Add City
      </button>
      {message && (
        <p
          className={
            message.includes("successfully") ? "text-success" : "text-danger"
          }
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default AddCity;
