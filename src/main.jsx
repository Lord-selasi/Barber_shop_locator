import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./pages/App";
import SearchBarbershops from "./pages/SearchBarbershops";
import AddCity from "./pages/AddCity";

const Main = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/search" element={<SearchBarbershops />} />
      <Route path="/add-city" element={<AddCity />} />
    </Routes>
  </Router>
);

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(<Main />);
