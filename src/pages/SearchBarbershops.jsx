import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";

const SearchBarbershops = () => {
  const [position, setPosition] = useState(null);
  const [radius, setRadius] = useState(""); // Default to empty string
  const [barbershops, setBarbershops] = useState([]);
  const [selectedBarbershop, setSelectedBarbershop] = useState(null);
  const [error, setError] = useState(null);

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

  const handleSearch = () => {
    if (!radius) {
      setError("Please enter a radius");
      return;
    }

    const url = `http://127.0.0.1:5000/api/barbershops?lat=${position[0]}&lng=${position[1]}&radius=${radius}`;
    console.log(`Fetching barbershops from URL: ${url}`);
    fetch(url)
      .then((response) => {
        console.log("Response received:", response);
        return response.json();
      })
      .then((data) => {
        console.log("Parsed JSON data:", data); // Log the received data
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
          console.log("Updated Barbershops:", updatedBarbershops); // Log updated barbershops
          setBarbershops(
            updatedBarbershops.sort((a, b) => a.distance - b.distance)
          );
        }
      })
      .catch((err) => {
        console.error("Failed to fetch barbershops:", err);
        setError("Failed to fetch barbershops");
        setBarbershops([]);
      });
  };

  const handleSelectBarbershop = (shop) => {
    setSelectedBarbershop(shop);
  };

  const handlePositionUpdate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
        },
        (error) => {
          console.error(error.message);
        }
      );
    }
  };

  useEffect(() => {
    handlePositionUpdate();
  }, []);

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // in metres
    return d.toFixed(2);
  };

  const renderDirections = () => {
    if (!selectedBarbershop) return null;

    const start = [position[0], position[1]];
    const end = [selectedBarbershop.latitude, selectedBarbershop.longitude];
    const polyline = [start, end];
    const distance = selectedBarbershop.distance;

    return (
      <Polyline positions={polyline} color="blue">
        <Tooltip sticky>{distance} meters</Tooltip>
      </Polyline>
    );
  };

  return (
    <div className="container" style={{ textAlign: "center" }}>
      <h2>Search Barbershops</h2>
      <input
        type="number"
        value={radius}
        onChange={(e) => setRadius(e.target.value)}
        placeholder="Enter search radius for nearby barbershops (meters)"
        style={{ width: "300px" }}
      />
      <br />
      <button onClick={handleSearch}>Search</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <MapContainer
        center={position || [45.550288, -94.1555175]}
        zoom={25}
        style={{ height: "50vh", width: "100%" }}
        whenReady={(map) => position && map.target.setView(position, 13)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {barbershops.map((shop, idx) =>
          selectedBarbershop && selectedBarbershop !== shop ? null : (
            <Marker key={idx} position={[shop.latitude, shop.longitude]}>
              <Popup>
                {shop.name} <br /> {shop.address}
                <br />
                <button onClick={() => handleSelectBarbershop(shop)}>
                  Get Directions
                </button>
              </Popup>
            </Marker>
          )
        )}
        {position && (
          <Marker position={position}>
            <Popup>My Location</Popup>
          </Marker>
        )}
        {renderDirections()}
      </MapContainer>
      <div style={{ marginTop: "20px" }}>
        <h3>Barbershops:</h3>
        <ul>
          {barbershops.map((shop, idx) => (
            <li
              key={idx}
              className="barbershop-card"
              style={{
                display:
                  selectedBarbershop && selectedBarbershop !== shop
                    ? "none"
                    : "block",
              }}
            >
              <div className="barbershop-info">
                <strong>{shop.name}</strong>
                <p>{shop.address}</p>
                <p>{shop.distance} meters away</p>
                <button onClick={() => handleSelectBarbershop(shop)}>
                  Show on Map
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchBarbershops;
