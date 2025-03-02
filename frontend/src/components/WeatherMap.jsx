import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 🟢 Оправяме маркера
const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const WeatherMap = ({ weather }) => {
  const [position, setPosition] = useState([42.6975, 23.3242]); // София по подразбиране
  const [cityName, setCityName] = useState("София");

  useEffect(() => {
    if (weather && weather.coord) {
      const { lat, lon } = weather.coord;
      setPosition([lat, lon]);
      setCityName(weather.name);
    }
  }, [weather]);

  function MapUpdater() {
    const map = useMap();
    useEffect(() => {
      if (position) {
        map.setView(position, 8); // Центрираме картата към новата локация
      }
    }, [position]);
    return null;
  }

  return (
    <div className="p-4 bg-white shadow-lg rounded-xl w-full">
      <h3 className="text-lg font-semibold mb-2">🌍 Карта на времето</h3>
      <MapContainer
        center={position}
        zoom={8}
        className="w-full h-96 rounded-lg"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapUpdater />
        <Marker position={position} icon={customIcon}>
          <Popup>
            <strong>{cityName}</strong>
            <br />
            📍 Локация: {position[0].toFixed(2)}, {position[1].toFixed(2)}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default WeatherMap;
