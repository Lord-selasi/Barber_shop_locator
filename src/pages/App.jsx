import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const defaultPosition = [51.505, -0.09];
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="container text-center">
      <h1
        className="my-4"
        style={{
          fontSize: "2.5rem",
          textShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
          letterSpacing: "1px",
          background: "linear-gradient(45deg, #28a745, #007bff)",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        Welcome to the Barbershop Locator!
      </h1>
      <div className="nav-container mb-4">
        <nav>
          <button
            onClick={toggleDropdown}
            className="btn btn-primary dropdown-toggle"
          >
            Menu
          </button>
          {dropdownOpen && (
            <ul className="dropdown-menu show">
              <li>
                <Link to="/search" className="dropdown-item">
                  Search Barbershops
                </Link>
              </li>
              <li>
                <Link to="/add-city" className="dropdown-item">
                  Add City
                </Link>
              </li>
            </ul>
          )}
        </nav>
      </div>
      <MapContainer
        center={defaultPosition}
        zoom={13}
        style={{ height: "50vh", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </div>
  );
};

export default App;
