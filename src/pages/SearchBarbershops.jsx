import React, { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";

const SearchBarbershops = () => {
  const [position, setPosition] = useState([51.505, -0.09]);
  const [radius, setRadius] = useState(1000); // in meters
  const [barbershops, setBarbershops] = useState([]);

  const handleSearch = () => {
    fetch(
      `/api/barbershops?lat=${position[0]}&lng=${position[1]}&radius=${radius}`
    )
      .then((response) => response.json())
      .then((data) => setBarbershops(data))
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h2>Search Barbershops</h2>
      <input
        type="number"
        value={radius}
        onChange={(e) => setRadius(e.target.value)}
        placeholder="Search Radius (meters)"
      />
      <button onClick={handleSearch}>Search</button>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {barbershops.map((shop, idx) => (
          <Marker key={idx} position={[shop.latitude, shop.longitude]} />
        ))}
      </MapContainer>
    </div>
  );
};

export default SearchBarbershops;
