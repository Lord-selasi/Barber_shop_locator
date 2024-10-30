# Barbershop Locator

Welcome to the Barbershop Locator project! This application allows users to search for nearby barbershops, add new cities, and view directions to selected barbershops using a user-friendly map interface.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)

## Features

- **Search Barbershops**: Find nearby barbershops based on your current location and specified search radius.
- **Add City**: Allow users to add new cities to the application for barbershop searching.
- **Map Integration**: Interactive map using Leaflet for displaying barbershops and user locations.
- **Routing**: Get directions to selected barbershops from your current location.

## Technologies Used

- **Frontend**:

  - React
  - Vite
  - Bootstrap
  - Leaflet
  - Axios

- **Backend**:
  - Flask
  - PostgreSQL (with PostGIS for spatial data)

## Installation

To set up the Barbershop Locator project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Lord-selasi/Barber_shop_locator.git
   cd barbershop-locator
   ```
2. Install dependencies: No Node.js is used in this project, but ensure you have Python and Flask set up.

3. Set up the Flask backend:

- Create a virtual environment and activate it:
  python -m venv venv
  source venv/bin/activate # On Windows use `venv\Scripts\activate`

- Install Flask and other dependencies:
  pip install -r requirements.txt
- Run the Flask server: Ensure your PostgreSQL database is running and configured. Then start your Flask app:
  python app.py
- Run the React frontend: In another terminal, navigate to the frontend directory and run:
  npm run dev # If using npm, or equivalent for your package manager

- Usage

Open your browser and navigate to http://localhost:3000 (or the specified port).
Use the Menu to search for barbershops or add a new city.
Interact with the map to view barbershop locations and get directions.
