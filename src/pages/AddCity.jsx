import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "bootstrap/dist/css/bootstrap.min.css";

const AddCity = () => {
  // State to hold the city name input by the user
  const [cityName, setCityName] = useState("");
  // State to hold the selected position on the map (latitude and longitude)
  const [position, setPosition] = useState(null);
  // State to hold messages for the user (success or error)
  const [message, setMessage] = useState("");

  // MapClickHandler component to handle map click events
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        // Set the position state to the latitude and longitude of the clicked location
        setPosition([e.latlng.lat, e.latlng.lng]);
        setMessage(""); // Clear any existing messages
      },
    });
    return null; // Return null since this component doesn't render anything
  };

  // Function to handle the addition of a new city
  const handleAddCity = () => {
    // Check if both cityName and position are provided
    if (!cityName || !position) {
      setMessage("Please enter a city name and select a position on the map.");
      return; // Exit if validation fails
    }

    // Send a POST request to the server to add the new city
    fetch("http://127.0.0.1:5000/api/cities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: cityName, // Pass the city name
        latitude: position[0], // Pass the latitude of the selected position
        longitude: position[1], // Pass the longitude of the selected position
      }),
    })
      .then((response) => response.json()) // Parse the JSON response
      .then((data) => {
        setMessage("City added successfully!"); // Set success message
        setCityName(""); // Clear the city name input
        setPosition(null); // Reset the position state
      })
      .catch((err) => {
        console.error(err); // Log any errors
        setMessage("Error adding city."); // Set error message
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
        value={cityName} // Controlled input for city name
        onChange={(e) => setCityName(e.target.value)} // Update state on input change
        placeholder="Enter City Name" // Placeholder for the input
        className="form-control mb-3"
        style={{ maxWidth: "300px", margin: "0 auto" }} // Styling for the input
      />
      <MapContainer
        center={[51.505, -0.09]} // Initial center of the map
        zoom={13} // Initial zoom level
        style={{ height: "50vh", width: "100%", marginBottom: "10px" }} // Map styling
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />{" "}
        {/* Tile layer for the map */}
        <MapClickHandler /> {/* Component to handle map click events */}
        {position && <Marker position={position}></Marker>}{" "}
        {/* Display marker if position is set */}
      </MapContainer>
      <button onClick={handleAddCity} className="btn btn-primary mb-3">
        Add City {/* Button to trigger adding the city */}
      </button>
      {message && (
        <p
          className={
            message.includes("successfully") ? "text-success" : "text-danger" // Conditional class for message styling
          }
        >
          {message} {/* Display success or error message */}
        </p>
      )}
    </div>
  );
};

export default AddCity; // Export the AddCity component
