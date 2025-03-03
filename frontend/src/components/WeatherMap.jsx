import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 🟢 Твоят API ключ от MapTiler
const mapTilerKey = "qPnzBxOqlXMEiIsi9DIP";

// 🗺️ Слоеве за светъл и тъмен режим (ТОВА РАБОТИ)
const lightTileLayer = `https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${mapTilerKey}`;
const darkTileLayer = `https://api.maptiler.com/maps/toner-lite/{z}/{x}/{y}.png?key=${mapTilerKey}`;

// 🟢 Оправен маркер
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

const WeatherMap = ({ weather, darkMode }) => {
  const [position, setPosition] = useState([42.6975, 23.3242]); // София по подразбиране

  useEffect(() => {
    if (weather && weather.coord) {
      const { lat, lon } = weather.coord;
      setPosition([lat, lon]);
    }
  }, [weather]);

  function MapUpdater() {
    const map = useMap();
    useEffect(() => {
      if (position) {
        map.setView(position, 12);
      }
    }, [position]);
    return null;
  }

  if (!weather || !weather.coord) return null;
  const { lat, lon } = weather.coord;

  return (
    <div className="p-4 forecast shadow-lg rounded-xl w-full">
      <h3 className="text-lg   font-semibold mb-2">🌍 Карта на времето</h3>
      <MapContainer
        center={[lat, lon]}
        zoom={10}
        className="h-64 w-full rounded-lg"
      >
        <TileLayer
          url={darkMode ? darkTileLayer : lightTileLayer}
          attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={[lat, lon]} icon={customIcon}>
          <Popup>{weather.name}</Popup>
        </Marker>
        <MapUpdater />
      </MapContainer>
    </div>
  );
};

export default WeatherMap;
