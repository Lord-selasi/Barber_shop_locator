import React from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const App = () => {
  const defaultPosition = [51.505, -0.09];
  const markers = [{ position: defaultPosition, text: "Default Location" }];

  return (
    <div className="container">
      <h1>Barbershop Locator</h1>
      <nav>
        <ul>
          <li>
            <Link to="/search">Search Barbershops</Link>
          </li>
          <li>
            <Link to="/add-city">Add City</Link>
          </li>
        </ul>
      </nav>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: "50vh", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </div>
  );
};

export default App;
