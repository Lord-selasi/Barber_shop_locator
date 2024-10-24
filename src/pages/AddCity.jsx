import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

const AddCity = () => {
  const [cityName, setCityName] = useState("");
  const [position, setPosition] = useState(null);
  const [message, setMessage] = useState("");

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        setPosition([e.latlng.lat, e.latlng.lng]);
        setMessage(""); // Clear any previous messages
      },
    });
    return null;
  };

  const handleAddCity = () => {
    if (!cityName || !position) {
      setMessage("Please enter a city name and select a position on the map.");
      return;
    }

    fetch("/api/cities", {
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
        setCityName(""); // Clear the input fields
        setPosition(null);
      })
      .catch((err) => {
        console.error(err);
        setMessage("Error adding city.");
      });
  };

  return (
    <div>
      <h2>Add New City</h2>
      <input
        type="text"
        value={cityName}
        onChange={(e) => setCityName(e.target.value)}
        placeholder="Enter City Name"
      />
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: "50vh", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler />
        {position && <Marker position={position}></Marker>}
      </MapContainer>
      <button onClick={handleAddCity}>Add City</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddCity;
