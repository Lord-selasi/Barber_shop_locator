import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Map = ({ barbershops }) => {
  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {barbershops.map((shop) => (
        <Marker key={shop.id} position={[shop.lat, shop.lon]}>
          <Popup>{shop.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
